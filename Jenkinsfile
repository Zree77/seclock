pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = '658469473117'
        ECR_REPOSITORY = 'seclock'
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        IMAGE_NAME = "${ECR_REGISTRY}/${ECR_REPOSITORY}"
        IMAGE_TAG = "${BUILD_NUMBER}"
        SONARQUBE = 'SonarQube'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    python3 --version
                    python3 -m pip install --upgrade pip
                    pip3 install -r requirements.txt
                    pip3 install pytest
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    pytest -v
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv("${SONARQUBE}") {
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=SECLOCK \
                          -Dsonar.projectName=SECLOCK \
                          -Dsonar.sources=. \
                          -Dsonar.exclusions="k8s/**,sample_certificates/**,__pycache__/**"
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Docker Build') {
            steps {
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
                sh '''
                    sed -i \
                      "s|image: .*|image: ${IMAGE_NAME}:${IMAGE_TAG}|" \
                      k8s/deployment.yaml
                '''
            }
        }

        stage('Commit & Push Git Change') {
            steps {
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
                            echo "No Kubernetes manifest changes."
                        else
                            git commit -m "Update SECLOCK image to ${IMAGE_TAG}"

                            git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/Zree77/seclock.git \
                              HEAD:${BRANCH_NAME}
                        fi
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout ${ECR_REGISTRY} || true'
        }

        success {
            echo 'SECLOCK CI/CD pipeline completed successfully.'
            echo 'Argo CD will detect the Git change and synchronize EKS.'
        }

        failure {
            echo 'SECLOCK CI/CD pipeline failed.'
        }
    }
}
