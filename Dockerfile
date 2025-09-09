# Dockerfile
# Use a base image with the correct Python version (>=3.7, <3.10)
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the necessary port
EXPOSE 8080

# Run the application
CMD ["python", "app.py"]
