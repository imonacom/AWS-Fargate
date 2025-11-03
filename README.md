🚀 AWS Fargate PoC — Sunucusuz Node.js Dağıtımı

Bu proje, Node.js tabanlı bir web uygulamasını AWS Fargate üzerinde tam otomatik CI/CD hattı ile dağıtmak için hazırlanmış bir Proof of Concept (PoC) çalışmasıdır.
Amaç, hiçbir manuel sunucu yönetimi yapmadan tamamen sunucusuz (serverless) bir yapı üzerinde container’ı otomatik olarak çalıştırmaktır.

🧩 Mimari Özeti

Proje mimarisi dört ana katmandan oluşur:

1. CI/CD Pipeline (GitHub Actions)

Kod main branch’ine gönderildiğinde otomatik olarak devreye girer.
Aşamalar:

Kaynak Kodun Checkout Edilmesi

AWS Kimlik Bilgilerinin Ayarlanması (GitHub Secrets)

Docker Image Oluşturulması (Build)

Amazon ECR’a Push Edilmesi

Yeni ECS Task Definition Kaydı

ECS Servisinin Güncellenmesi ve Yeni Dağıtımın Başlatılması

Bu süreç sayesinde her kod değişikliği sonrası otomatik olarak yeni container versiyonu AWS üzerinde ayağa kalkar.

2. Ağ ve Güvenlik (Networking & Security)

CloudFront → CDN, SSL ve önbellekleme katmanı sağlar.

AWS WAF → Web uygulamasını zararlı trafiğe karşı korur.

Security Groups → ALB ve ECS için güvenli bağlantı kurallarını tanımlar.

VPC → Public (ALB) ve Private (ECS & RDS) subnet’lerden oluşur.

NAT Gateway → ECS’in internet erişimini sağlar.

VPC Endpoints (ECR / S3) → AWS servislerine özel ağ üzerinden erişim sağlar.

3. Uygulama Katmanı (Application Layer)

ALB (Application Load Balancer) gelen trafiği Target Group üzerinden ECS Fargate Service’e yönlendirir.

ECS Fargate Service, container içinde çalışan Node.js uygulamasını çalıştırır.

Uygulama RDS MySQL veritabanına bağlıdır.

Tüm yapı serverless ve containerized olarak yönetilir — EC2 sunucusu yoktur.

4. İzleme ve Bildirim (Monitoring & Alerts)

CloudWatch → ECS ve uygulama metriklerini ve loglarını toplar.

SNS → CloudWatch alarm durumlarında e-posta bildirimi gönderir.

⚙️ Kullanılan Teknolojiler

Kategori	Araç / Servis
Bulut Platformu	AWS.

Compute (Çalışma Katmanı)	ECS Fargate.

Container Registry	Amazon ECR.

Veritabanı	Amazon RDS (MySQL).

Monitoring & Alerts	CloudWatch, SNS.

Ağ Katmanı	VPC, ALB, NAT Gateway, Security Groups.

CI/CD	GitHub Actions.

Runtime	Node.js.

Containerization	Docker.

🔐 Güvenlik

Tüm AWS erişim anahtarları ve değişkenler GitHub Secrets altında saklanır.

.env dosyası depoda bulunmaz, .gitignore içine eklenmiştir.

Kod veya yapılandırma dosyalarında gizli bilgi yoktur.

🧠 Öğrenilenler

Commit’ten deploy’a kadar tam otomatik bir pipeline kuruldu.

ECR, ECS Fargate, IAM, CloudWatch entegrasyonları uçtan uca test edildi.

CloudWatch + SNS ile izleme ve bildirim mekanizması uygulandı.

🧾 Süreç Akışı
Developer Push → GitHub Actions Trigger → Docker Build → ECR Push →
ECS Task Update → Fargate Redeploy → CloudWatch Monitoring → SNS Alert

📦 Proje Yapısı
.
├── app.js                 # Node.js backend
├── Dockerfile             # Docker imajı oluşturma dosyası
├── package.json           # Bağımlılıklar
├── .github/
│   └── workflows/
│       └── deploy.yml     # CI/CD pipeline dosyası
└── README.md              # Proje açıklaması

📊 Mimari Diyagram

Bu diyagram, GitHub Actions pipeline’ından başlayarak AWS Fargate, RDS ve CloudWatch akışını gösterir.
(Proje dizininde görsel olarak eklenmiştir.)
