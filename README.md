# database_metin
Bu proje mini bir kütüphane veritabanını yönetmek ve kitap takip işlemlerini simüle etmek için yapılmıştır.

Projede Bun.js'i kullandım. Bun.js ile senkron çalışması için TypeScript dilini tercih ettim. Verileri güvenli ve ilişkisel tutmak için de sektör standardı olan PostgreSQL'i seçtim.

Veritabanında 4 ana tablo bulunuyor:
* **yazarlar:** Yazarların tutulduğu tablo.
* **kategoriler:** Kitap türlerinin (Roman, Tarih vb.) tutulduğu tablo.
* **kitaplar:** Kitapların tutulduğu ana tablo. (Yazar ve Kategori bilgileri buraya bağlanıyor).
* **oduncTablo:** Ödünç alma işlemlerinin takibi burada yapılıyor. (Kitap şu an kimde, ne zaman iade edilecek?)


Projeyi çalıştırmak için bun kurmanız gerekiyor.
Sonrasında da postgres eklemeniz gerekiyor.
Aşağıdaki iki kodu terminale yapıştırdığınızda bulunduğunuz klasöre gerekli dosyalar eklenecektir.

```bash 
bun install
bun add postgres
```

Çalıştırmak için:
Öncelikle .env dosyası oluşturmanız gerekiyor (database şifresini içine saklayacağız).
içerisine DB_PASSWORD değişkeni tanımlayıp değer olarak şifrenizi atayınız.
Sonrasında terminale aşağıdaki kodu yapıştırdığınızda yazdığınız sql kodlarına göre tablolar oluşturulup tabloların içerisine veri girişi yapılıyor. 
```bash
bun run index.ts
```