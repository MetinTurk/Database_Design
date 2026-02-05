import postgres from 'postgres';

const sql = postgres({
    host: 'localhost',      
    port: 5432,             
    database: 'postgres',   
    username: 'postgres',   
    password: process.env.DB_PASSWORD,     
});

async function main() {
    console.log("Bağlantı deneniyor");
    try {
        await sql`DROP TABLE IF EXISTS oduncTablo, kitaplar, yazarlar, kategoriler CASCADE`;

        console.log("Tablolar oluşturuluyor");

        //Kategoriler 
        await sql`
            CREATE TABLE kategoriler (
                id SERIAL PRIMARY KEY,
                adi VARCHAR(50) NOT NULL
            );
        `;

        //Yazarlar
        await sql`
            CREATE TABLE yazarlar (
                id SERIAL PRIMARY KEY,
                adi VARCHAR(100) NOT NULL
            );
        `;

        //Kitaplar 
        await sql`
            CREATE TABLE kitaplar (
                id SERIAL PRIMARY KEY,
                baslik VARCHAR(150) NOT NULL,
                yazar_id INT REFERENCES yazarlar(id),
                kategori_id INT REFERENCES kategoriler(id),
                eklenme_tarihi DATE DEFAULT CURRENT_DATE
            );
        `;

        //Ödünç Takip 
        await sql`
            CREATE TABLE oduncTablo (
                id SERIAL PRIMARY KEY,
                kitap_id INT REFERENCES kitaplar(id),
                uye_adi VARCHAR(100) NOT NULL,
                odunc_tarihi DATE DEFAULT CURRENT_DATE,
                teslim_tarihi DATE NOT NULL,
                iade_tarihi DATE 
            );
        `;

        console.log("Veritabanı tasarımı tamamlandı.\n");


        // Yazarları ekledim
        await sql`INSERT INTO yazarlar (adi) VALUES ('George Orwell'), ('J.K. Rowling'), ('Sabahattin Ali')`;

        // Kategorileri ekledim
        await sql`INSERT INTO kategoriler (adi) VALUES ('Distopya'), ('Fantastik'), ('Türk Edebiyatı')`;

        // Kitapları ekledim 
        await sql`
            INSERT INTO kitaplar (baslik, yazar_id, kategori_id) VALUES 
            ('1984', 1, 1),
            ('Harry Potter', 2, 2),
            ('Kürk Mantolu Madonna', 3, 3);
        `;

        // Ödünç hareketleri ekledim
        await sql`
            INSERT INTO oduncTablo (kitap_id, uye_adi, teslim_tarihi, iade_tarihi) VALUES 
            (1, 'Metin Türk', '2026-02-01', NULL),              -- İADE EDİLMEMİŞ (Tarihi geçmiş!)
            (2, 'Sıla Aydın', '2026-03-01', NULL),              -- İADE EDİLMEMİŞ (Henüz süresi var)
            (3, 'Mehmet Demir', '2026-01-15', '2026-01-14');    -- İADE EDİLMİŞ 
        `;

        console.log("Veriler eklendi.\n");


        console.log("SORGU 1: Hangi kitap hangi kategoride ve yazarı kim?");
        console.log("-------------------------------------------------------");
        // JOIN kullanarak 3 tabloyu birleştirdim.
        const kitapListesi = await sql`
            SELECT kitaplar.baslik as "Kitap", kategoriler.adi as "Kategori", yazarlar.adi as "Yazar"
            FROM kitaplar
            JOIN kategoriler ON kitaplar.kategori_id = kategoriler.id
            JOIN yazarlar ON kitaplar.yazar_id = yazarlar.id
        `;
        console.table(kitapListesi);


        console.log("\nSORGU 2: Şu an iade edilmemiş kitaplar hangileri?");
        console.log("------------------------------------------------------------------");
        const iadeEdilmeyenler = await sql`
            SELECT kitaplar.baslik as "Kitap Adı", oduncTablo.uye_adi as "Üye", oduncTablo.teslim_tarihi as "Son Teslim Tarihi"
            FROM oduncTablo
            JOIN kitaplar ON oduncTablo.kitap_id = kitaplar.id
            WHERE oduncTablo.iade_tarihi IS NULL
        `;
        console.table(iadeEdilmeyenler);

    } catch (hata) {
        console.error("HATA :", hata);
    } finally {
        await sql.end();
    }
}

main();