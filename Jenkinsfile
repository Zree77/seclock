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

        stage('Checkout') {
            steps {
                echo 'Checking out SECLOCK source code...'

                checkout scm

                sh '''
                    echo "Branch:"
                    git branch --show-current

                    echo "Commit:"
                    git rev-parse --short HEAD
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Creating Python virtual environment...'

                sh '''
                    python3 --version

                    rm -rf .venv

                    python3 -m venv .venv

                    .venv/bin/python -m pip install --upgrade pip

                    .venv/bin/pip install -r requirements.txt

                    .venv/bin/pip install pytest
                '''
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running SECLOCK tests...'

                sh '''
                    .venv/bin/pytest -v
                '''
            }
        }

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
                    echo "Docker image created:"
                    docker images ${IMAGE_NAME}
                '''
            }
        }

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

                        aws sts get-caller-identity

                        aws ecr get-login-password \
                          --region ${AWS_REGION} |
                        docker login \
                          --username AWS \
                          --password-stdin ${ECR_REGISTRY}
                    '''
                }
            }
        }

        stage('Push Image to ECR') {
            steps {
                echo "Pushing image ${IMAGE_NAME}:${IMAGE_TAG}"

                sh '''
                    docker push ${IMAGE_NAME}:${IMAGE_TAG}

                    docker push ${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Update Kubernetes Manifest') {
            steps {
                echo "Updating Kubernetes deployment image to ${IMAGE_TAG}..."

                sh '''
                    sed -i \
                      "s|^[[:space:]]*image:.*|          image: ${IMAGE_NAME}:${IMAGE_TAG}|" \
                      k8s/deployment.yaml

                    echo "Deployment image:"
                    grep "image:" k8s/deployment.yaml
                '''
            }
        }

        stage('Commit GitOps Change') {
            steps {
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
    *Username*) echo "$GIT_USERNAME" ;;
    *Password*) echo "$GIT_PASSWORD" ;;
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

    post {
        always {
            sh '''
                docker logout ${ECR_REGISTRY} || true
                rm -rf .venv
                rm -f .git-askpass
            '''
        }

        success {
            echo '''
============================================
SECLOCK CI/CD PIPELINE SUCCESSFUL
============================================

Tests              : PASSED
SonarQube          : COMPLETED
Docker Build       : PASSED
ECR Push            : PASSED
Kubernetes Update  : PASSED
Git Push            : PASSED

Argo CD will detect the Git change
and synchronize SECLOCK to EKS.

============================================
'''
        }

        failure {
            echo '''
============================================
SECLOCK CI/CD PIPELINE FAILED
============================================

Check the failed stage in the Jenkins console.

============================================
'''
        }
    }
}
