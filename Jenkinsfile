pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        AWS_REGION     = 'ap-south-1'
        AWS_ACCOUNT_ID = '658469473117'

        ECR_REPOSITORY = 'seclock'
        ECR_REGISTRY   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        IMAGE_NAME     = "${ECR_REGISTRY}/${ECR_REPOSITORY}"
        IMAGE_TAG      = "${BUILD_NUMBER}"

        SONARQUBE      = 'SonarQube'
        SONAR_SCANNER  = 'sonar-scanner'
    }

    stages {

        /*
         * 1. CHECKOUT
         */
        stage('Checkout') {
            steps {
                echo 'Checking out SECLOCK source code...'

                checkout scm

                sh '''
                    echo "Branch:"
                    git branch --show-current

                    echo "Commit:"
                    git rev-parse --short HEAD

                    echo "Repository:"
                    git remote -v
                '''
            }
        }

        /*
         * 2. INSTALL PYTHON DEPENDENCIES
         */
        stage('Install Dependencies') {
            steps {
                echo 'Installing SECLOCK application dependencies...'

                sh '''
                    python3 --version

                    rm -rf .venv

                    python3 -m venv .venv

                    .venv/bin/python -m pip install --upgrade pip

                    .venv/bin/pip install -r requirements.txt
                '''
            }
        }

        /*
         * 3. RUN END-TO-END TESTS
         */
        stage('Run Tests') {
            steps {
                echo 'Running SECLOCK end-to-end tests...'

                sh '''
                    # Starlette TestClient requires httpx2
                    .venv/bin/pip install httpx2

                    # test_e2e.py is a standalone test script
                    .venv/bin/python test_e2e.py
                '''
            }
        }

        /*
         * 4. SONARQUBE ANALYSIS
         */
        stage('SonarQube Analysis') {
            steps {
                script {
                    echo 'Running SonarQube analysis...'

                    def scannerHome = tool "${SONAR_SCANNER}"

                    withSonarQubeEnv("${SONARQUBE}") {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                              -Dsonar.projectKey=SECLOCK \
                              -Dsonar.projectName=SECLOCK \
                              -Dsonar.sources=. \
                              -Dsonar.exclusions="k8s/**,sample_certificates/**,__pycache__/**,.venv/**"
                        """
                    }
                }
            }
        }

        /*
         * 5. BUILD DOCKER IMAGE
         */
        stage('Docker Build') {
            steps {
                echo "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"

                sh '''
                    docker build \
                      -t ${IMAGE_NAME}:${IMAGE_TAG} \
                      -t ${IMAGE_NAME}:latest \
                      .
                '''

                sh '''
                    echo "Docker images created:"
                    docker images ${IMAGE_NAME}
                '''
            }
        }

        /*
         * 6. LOGIN TO AMAZON ECR
         */
        stage('ECR Login') {
            steps {
                echo 'Logging into Amazon ECR...'

                withCredentials([
                    usernamePassword(
                        credentialsId: 'aws-ecr-credentials',
                        usernameVariable: 'AWS_ACCESS_KEY_ID',
                        passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                    )
                ]) {
                    sh '''
                        export AWS_DEFAULT_REGION=${AWS_REGION}

                        echo "Checking AWS identity..."

                        aws sts get-caller-identity

                        echo "Logging into ECR..."

                        aws ecr get-login-password \
                          --region ${AWS_REGION} |
                        docker login \
                          --username AWS \
                          --password-stdin ${ECR_REGISTRY}
                    '''
                }
            }
        }

        /*
         * 7. PUSH DOCKER IMAGE TO ECR
         */
        stage('Push Image to ECR') {
            steps {
                echo "Pushing image ${IMAGE_NAME}:${IMAGE_TAG}"

                sh '''
                    docker push ${IMAGE_NAME}:${IMAGE_TAG}

                    docker push ${IMAGE_NAME}:latest
                '''
            }
        }

        /*
         * 8. UPDATE KUBERNETES MANIFEST
         */
        stage('Update Kubernetes Manifest') {
            steps {
                echo "Updating Kubernetes deployment image to ${IMAGE_TAG}..."

                sh '''
                    sed -i \
                      "s|^[[:space:]]*image:.*|          image: ${IMAGE_NAME}:${IMAGE_TAG}|" \
                      k8s/deployment.yaml

                    echo "Updated Kubernetes deployment image:"

                    grep "image:" k8s/deployment.yaml
                '''
            }
        }

        /*
         * 9. COMMIT KUBERNETES CHANGE
         */
        stage('Commit GitOps Change') {
            steps {
                echo 'Committing Kubernetes manifest change...'

                sh '''
                    git config user.name "Jenkins"
                    git config user.email "jenkins@localhost"

                    git add k8s/deployment.yaml

                    if git diff --cached --quiet; then
                        echo "No Kubernetes manifest changes detected."
                    else
                        git commit \
                          -m "Update SECLOCK image to ${IMAGE_TAG} [skip ci]"
                    fi
                '''
            }
        }

        /*
         * 10. PUSH MANIFEST CHANGE TO GITHUB
         */
        stage('Push GitOps Change') {
            steps {
                echo 'Pushing Kubernetes manifest update to GitHub...'

                withCredentials([
                    usernamePassword(
                        credentialsId: 'github-credentials',
                        usernameVariable: 'GIT_USERNAME',
                        passwordVariable: 'GIT_PASSWORD'
                    )
                ]) {
                    sh '''
                        cat > .git-askpass <<'EOF'
#!/bin/sh

case "$1" in
    *Username*)
        echo "$GIT_USERNAME"
        ;;
    *Password*)
        echo "$GIT_PASSWORD"
        ;;
esac
EOF

                        chmod 700 .git-askpass

                        export GIT_ASKPASS="$PWD/.git-askpass"
                        export GIT_TERMINAL_PROMPT=0

                        git push origin HEAD:main

                        rm -f .git-askpass
                    '''
                }
            }
        }
    }

    /*
     * POST BUILD ACTIONS
     */
    post {

        /*
         * ALWAYS RUN
         */
        always {
            sh '''
                echo "Cleaning up..."

                docker logout ${ECR_REGISTRY} || true

                rm -rf .venv

                rm -f .git-askpass
            '''
        }

        /*
         * SUCCESS
         */
        success {
            echo '''
============================================
      SECLOCK CI/CD PIPELINE SUCCESSFUL
============================================

Checkout           : PASSED
Dependencies       : PASSED
E2E Tests          : PASSED
SonarQube          : COMPLETED
Docker Build       : PASSED
ECR Login          : PASSED
ECR Push           : PASSED
Kubernetes Update  : PASSED
Git Push           : PASSED

Argo CD will detect the Git change
and synchronize SECLOCK to EKS.

============================================
'''
        }

        /*
         * FAILURE
         */
        failure {
            echo '''
============================================
        SECLOCK CI/CD PIPELINE FAILED
============================================

Check the failed stage in the Jenkins
console output.

============================================
'''
        }
    }
}
