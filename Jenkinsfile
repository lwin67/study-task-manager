pipeline {
  agent any

  // Auto-trigger on new commits (fallback if no webhook)
  triggers {
    pollSCM('H/2 * * * *')
  }

  stages {

    stage('Checkout') {
      steps {
        script {
          echo "Checking out source code..."
          checkout scm
        }
      }
    }

    stage('Validate Docker Compose') {
      steps {
        script {
          echo "Validating docker-compose.yml..."
          sh 'docker compose config'
        }
      }
    }

    stage('Prepare Environment') {
      steps {
        script {
          echo "Creating .env file from Jenkins credentials..."

          // Jenkins credentials (Secret text):
          //  - DATABASE_URL : full TiDB connection URL
          //  - AUTH_SECRET  : auth secret for your app
          withCredentials([
            string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL_VALUE'),
            string(credentialsId: 'AUTH_SECRET',  variable: 'AUTH_SECRET_VALUE')
          ]) {

            sh """
cat > .env <<EOF
DATABASE_URL=${DATABASE_URL_VALUE}
AUTH_SECRET=${AUTH_SECRET_VALUE}
AUTH_TRUST_HOST=true
EOF
"""
          }

          echo ".env file created (values not printed in logs)."
        }
      }
    }

    stage('Deploy with Docker Compose') {
      steps {
        script {
          echo "Stopping existing containers (if any)..."
          // -v here is optional; remove if you don't want to clear anonymous volumes
          sh 'docker compose down || true'

          echo "Building Docker image for study-task-manager..."
          sh 'docker compose build --no-cache'

          echo "Starting containers with Docker Compose..."
          sh 'docker compose up -d'

          echo "Current container status:"
          sh 'docker compose ps'
        }
      }
    }

    stage('Health Check') {
      steps {
        script {
          echo "Waiting for app to become healthy on http://localhost:3000 ..."

          // Wait up to ~60 seconds, retrying until HTTP 2xx
          sh """
            timeout 60 bash -c '
              until curl -fsS http://localhost:3000/ > /dev/null; do
                echo "App not ready yet, retrying in 3s...";
                sleep 3;
              done
            '
          """

          echo "Health check passed! App is responding on /"
        }
      }
    }

    stage('Show Logs & Info') {
      steps {
        script {
          echo "Showing container status and recent logs..."
          sh """
            echo "=== docker compose ps ==="
            docker compose ps
            echo ""
            echo "=== docker compose logs (last 30 lines) ==="
            docker compose logs --tail=30 || true
          """

          echo "If this is a VM, app should be reachable at:"
          echo "  - Inside VM:  http://localhost:3000"
          echo "  - From host:  http://<VM-IP>:3000  (e.g. http://192.168.56.1:3000)"
        }
      }
    }
  }

  post {
    success {
      script {
        echo "✅ CI/CD pipeline finished successfully."
      }
    }
    failure {
      script {
        echo "❌ CI/CD pipeline failed. Showing last logs for debugging..."
        sh 'docker compose logs --tail=50 || true'
      }
    }
    always {
      script {
        echo "Cleaning up unused Docker resources (images/containers)..."
        sh """
          docker image prune -f || true
          docker container prune -f || true
        """
      }
    }
  }
}
