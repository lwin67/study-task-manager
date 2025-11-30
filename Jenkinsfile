pipeline {
  agent any

  triggers {
    // Poll SCM every 2 minutes (fallback if no webhook)
    pollSCM('H/2 * * * *')
  }

  environment {
    // Build info
    BUILD_TAG = "${env.BUILD_NUMBER}"
    GIT_COMMIT_SHORT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
  }

  parameters {
    booleanParam(
      name: 'CLEAN_VOLUMES',
      defaultValue: false,
      description: 'Remove volumes (clears database)'
    )
    string(
      name: 'APP_HOST',
      defaultValue: 'http://192.168.56.1:3000',
      description: 'Deployed app URL for reference.'
    )
  }

  stages {

    stage('Checkout') {
      steps {
        script {
          echo "Checking out code."
          checkout scm
          echo "Deploying Study Task Manager"
          echo "Build: ${BUILD_TAG}, Commit: ${GIT_COMMIT_SHORT}"
        }
      }
    }

    stage('Validate Docker Compose') {
      steps {
        script {
          echo "Validating Docker Compose configuration."
          sh 'docker compose config'
        }
      }
    }

    stage('Prepare Environment') {
      steps {
        script {
          echo "Preparing .env configuration for Docker Compose."

          // Load credentials from Jenkins
          withCredentials([
            string(credentialsId: 'MYSQL_ROOT_PASSWORD', variable: 'MYSQL_ROOT_PASS'),
            string(credentialsId: 'MYSQL_PASSWORD',      variable: 'MYSQL_PASS'),
            string(credentialsId: 'AUTH_SECRET',         variable: 'AUTH_SECRET_VALUE')
          ]) {

            sh """
cat > .env <<EOF
# MySQL
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASS}
MYSQL_DATABASE=studytasks_db
MYSQL_USER=studytasks_user
MYSQL_PASSWORD=${MYSQL_PASS}
MYSQL_PORT=3306

# phpMyAdmin
PHPMYADMIN_PORT=8888

# App
FRONTEND_PORT=3000
AUTH_SECRET=${AUTH_SECRET_VALUE}
AUTH_TRUST_HOST=true

# Prisma / Next.js DB URL (app connects to db service)
DATABASE_URL=mysql://studytasks_user:${MYSQL_PASS}@db:3306/studytasks_db
EOF
"""
          }

          echo ".env file created (values hidden from logs)."
        }
      }
    }

    stage('Deploy with Docker Compose') {
      steps {
        script {
          echo "Deploying stack with Docker Compose."

          // Stop existing containers
          def downCommand = 'docker compose down'
          if (params.CLEAN_VOLUMES) {
            echo "WARNING: Removing volumes (database will be cleared)."
            downCommand = 'docker compose down -v'
          }
          sh downCommand

          // Build and start
          sh """
            docker compose build --no-cache
            docker compose up -d
          """

          echo "Docker Compose deployment triggered."
        }
      }
    }

    stage('Health Check') {
      steps {
        script {
          echo "Waiting for app to start..."
          sh 'sleep 20'

          echo "Checking container status."
          sh 'docker compose ps'

          echo "Performing HTTP health check on Next.js app."
          sh """
            # Wait up to 60s for the homepage to respond with 2xx
            timeout 60 bash -c 'until curl -f http://localhost:3000/; do
              echo "Waiting for app...";
              sleep 3;
            done' || exit 1

            echo "Health check passed!"
          """
        }
      }
    }

    stage('Verify Deployment') {
      steps {
        script {
          echo "Verifying services and showing logs."
          sh """
            echo "=== Container Status ==="
            docker compose ps
            echo ""
            echo "=== Recent Logs (last 20 lines) ==="
            docker compose logs --tail=20
            echo ""
            echo "App should be accessible at:"
            echo " - Local (VM):  http://localhost:3000"
            echo " - From host:   ${params.APP_HOST}"
            echo " - phpMyAdmin:  http://localhost:8888"
          """
        }
      }
    }
  }

  post {
    success {
      echo "✅ Deployment successful."
      echo "Build: ${BUILD_TAG}, Commit: ${GIT_COMMIT_SHORT}"
    }
    failure {
      echo "❌ Deployment failed. Showing logs:"
      script {
        sh 'docker compose logs --tail=50 || true'
      }
    }
    always {
      echo "Cleaning up unused Docker resources…"
      sh """
        docker image prune -f
        docker container prune -f
      """
    }
  }
}
