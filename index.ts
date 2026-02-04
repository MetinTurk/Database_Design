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
        const sonuc = await sql`SELECT version()`;
        
        console.log("Veritabanına bağlandı.");
        console.log("Versiyon Bilgisi:", sonuc[0].version);

    } catch (hata) {
        console.error("HATA :", hata);
    } finally {
        await sql.end();
    }
}

main();