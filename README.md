# AWS Fargate PoC — Serverless Node.js Deployment

Bu proje, Node.js tabanlı bir web uygulamasını AWS üzerinde tamamen serverless bir yapıda çalıştırmak için hazırladığım küçük bir **Fargate Proof of Concept (PoC)** çalışmasıdır.  
Amacım, EC2 gibi fiziksel sunucu yönetimiyle uğraşmadan, container’ı doğrudan **ECS Fargate** üzerinde çalıştırmaktı.

---

## 🚀 Amaç

Basit bir Node.js uygulamasını **Dockerize edip**, AWS ECR’a push ettim.  
Sonrasında ECS üzerinden **Fargate** kullanarak container’ı ayağa kaldırdım.  
Bu süreçte AWS servisleri arasında bağlantıları (ECR → ECS → IAM → Security Group → CloudWatch) manuel olarak oluşturdum.

---

## ⚙️ Kullanılan AWS Servisleri

- **Amazon ECR** → Docker imajını barındırmak için  
- **Amazon ECS (Fargate)** → Container’ı sunucusuz şekilde çalıştırmak için  
- **IAM Role** → ECS’in ECR’dan imaj çekebilmesi için gerekli yetkilendirme  
- **VPC & Security Group** → Ağ yönetimi ve port 3000 erişimi  
- **CloudWatch Logs** → Uygulama loglarını izlemek için  

---

## 📦 Proje Akışı

1. Node.js uygulamasını `Dockerfile` kullanarak container haline getirdim.  
2. Docker image’ı AWS ECR’a push ettim.  
3. ECS üzerinde bir **Task Definition** tanımladım.  
4. Fargate Service oluşturarak container’ı public IP üzerinden erişilebilir hale getirdim.  
5. Tarayıcıdan test ederek çalıştığını doğruladım (`http://<public-ip>:3000`).  

Uygulama başarıyla döndüğünde konsolda `Server running on port 3000` mesajı görülüyor.

---

## 🐳 Docker Komutları

```bash
# Docker image oluştur
docker build -t fargate-poc .

# AWS ECR'a giriş yap
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.eu-central-1.amazonaws.com

# Image'ı etiketle
docker tag fargate-poc:latest <AWS_ACCOUNT_ID>.dkr.ecr.eu-central-1.amazonaws.com/fargate-poc:latest

# Image'ı ECR'a yükle
docker push <AWS_ACCOUNT_ID>.dkr.ecr.eu-central-1.amazonaws.com/fargate-poc:latest


## ☁️ ECS & Fargate Kurulumu
# ECS cluster oluştur
aws ecs create-cluster --cluster-name fargate-poc-cluster

# Task Definition kaydet (örnek JSON dosyası ile)
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Fargate service oluştur
aws ecs create-service \
  --cluster fargate-poc-cluster \
  --service-name fargate-poc-service \
  --task-definition fargate-poc-task \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxx],securityGroups=[sg-xxxx],assignPublicIp=ENABLED}"

## 🧪 Test

http://<public-ip>:3000

Yanıt olarak:
Server running on port 3000

CloudWatch üzerinde container loglarını da görüntüledim.

## 🧠 Özet

Bu PoC sayesinde AWS Fargate üzerinde bir Node.js uygulamasının EC2 gerektirmeden nasıl çalıştırılabileceğini deneyimledim.
Sunucusuz mimari yaklaşımıyla sistemin yönetim yükü azaldı ve ölçeklenebilirlik kolaylaştı.
Ayrıca AWS CLI üzerinden servislerin manuel kurulumu, mimariyi daha iyi anlamamı sağladı.