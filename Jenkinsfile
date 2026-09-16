```groovy
pipeline {
    agent any

    environment {
        AWS_REGION     = 'ap-south-1'
        AWS_ACCOUNT_ID = '658469473117'
        ECR_REPOSITORY = 'seclock'
        ECR_REGISTRY   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        IMAGE_NAME     = "${ECR_REGISTRY}/${ECR_REPOSITORY}"
        IMAGE_TAG      = "${BUILD_NUMBER}"

        SONARQUBE      = 'SonarQube'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out SECLOCK source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Creating Python virtual environment...'

                sh '''
                    python3 --version

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
                echo 'Running SonarQube analysis...'

                withSonarQubeEnv("${SONARQUBE}") {

                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=SECLOCK \
                          -Dsonar.projectName=SECLOCK \
                          -Dsonar.sources=. \
                          -Dsonar.exclusions="k8s/**,sample_certificates/**,__pycache__/**,.venv/**"
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                echo 'Waiting for SonarQube Quality Gate...'

                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
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
            }
        }

        stage('ECR Login & Push') {
            steps {
                echo 'Logging into Amazon ECR and pushing image...'

                withCredentials([
                    usernamePassword(
                        credentialsId: 'aws-ecr-credentials',
                        usernameVariable: 'AWS_ACCESS_KEY_ID',
                        passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                    )
                ]) {

                    sh '''
                        export AWS_DEFAULT_REGION=${AWS_REGION}

                        aws ecr get-login-password \
                          --region ${AWS_REGION} |
                        docker login \
                          --username AWS \
                          --password-stdin ${ECR_REGISTRY}

                        docker push ${IMAGE_NAME}:${IMAGE_TAG}

                        docker push ${IMAGE_NAME}:latest
                    '''
                }
            }
        }

        stage('Update Kubernetes Manifest') {
            steps {
                echo "Updating Kubernetes deployment to image tag ${IMAGE_TAG}..."

                sh '''
                    sed -i \
                      "s|image: .*|image: ${IMAGE_NAME}:${IMAGE_TAG}|" \
                      k8s/deployment.yaml

                    echo "Updated deployment.yaml:"
                    grep "image:" k8s/deployment.yaml
                '''
            }
        }

        stage('Commit & Push Git Change') {
            steps {
                echo 'Committing updated Kubernetes manifest...'

                withCredentials([
                    usernamePassword(
                        credentialsId: 'github-credentials',
                        usernameVariable: 'GIT_USERNAME',
                        passwordVariable: 'GIT_PASSWORD'
                    )
                ]) {

                    sh '''
                        git config user.name "Jenkins"
                        git config user.email "jenkins@localhost"

                        git add k8s/deployment.yaml

                        if git diff --cached --quiet; then
                            echo "No Kubernetes manifest changes to commit."
                        else
                            git commit \
                              -m "Update SECLOCK image to ${IMAGE_TAG}"

                            git push \
                              https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/Zree77/seclock.git \
                              HEAD:${BRANCH_NAME}
                        fi
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
            '''
        }

        success {
            echo '============================================'
            echo 'SECLOCK CI/CD PIPELINE SUCCESSFUL'
            echo '============================================'
            echo "Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
            echo 'Image pushed successfully to Amazon ECR.'
            echo 'Kubernetes manifest updated in GitHub.'
            echo 'Argo CD will synchronize the EKS deployment.'
        }

        failure {
            echo '============================================'
            echo 'SECLOCK CI/CD PIPELINE FAILED'
            echo '============================================'
            echo 'Check the failed stage in the Jenkins console.'
        }
    }
}
```

