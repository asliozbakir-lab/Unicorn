const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const osgedaPath = 'C:/Users/asliokten/Desktop/temp_osgeda/data/osgeda_modules.json';
  if (!fs.existsSync(osgedaPath)) {
    console.error('OSGEDA data not found at:', osgedaPath);
    return;
  }

  const osgeda = JSON.parse(fs.readFileSync(osgedaPath, 'utf8'));
  console.log('OSGEDA modules loaded:', osgeda.modules.length);

  // 1. KARDEŞ ŞEHİRLER (31 ADET)
  const kardesMod = osgeda.modules.find(m => m.id === 'kardes_sehirler');
  if (kardesMod && kardesMod.sub_items) {
    console.log(`Processing ${kardesMod.sub_items.length} sister cities...`);
    for (const city of kardesMod.sub_items) {
      // Map logo path to local public url
      let logoUrl = null;
      if (city.logo) {
        const logoFilename = path.basename(city.logo);
        const publicLogoPath = path.join(__dirname, '../public/logos/kardes_sehirler', logoFilename);
        if (fs.existsSync(publicLogoPath)) {
          logoUrl = `/logos/kardes_sehirler/${logoFilename}`;
        }
      }

      const cityName = city.city || city.name.split('(')[0].trim();
      const countryName = city.country || 'Uluslararası';

      // Check if existing by cityName
      const existing = await prisma.sisterCity.findFirst({
        where: { cityName: { contains: cityName } }
      });

      const scopeInfo = [
        city.region ? `Bölge: ${city.region}` : null,
        city.status ? `Durum: ${city.status}` : null,
        city.opportunities ? `Fırsatlar: ${city.opportunities}` : null,
      ].filter(Boolean).join(' | ');

      const notesInfo = [
        city.details || null,
        city.contact ? `İletişim / Muhatap: ${city.contact}` : null,
        city.drive_url ? `Drive Arşivi: ${city.drive_url}` : null,
      ].filter(Boolean).join('\n\n');

      if (existing) {
        await prisma.sisterCity.update({
          where: { id: existing.id },
          data: {
            cityName: cityName,
            countryName: countryName,
            flagEmoji: city.flag || existing.flagEmoji,
            logoUrl: logoUrl || existing.logoUrl,
            protocolDate: city.year || existing.protocolDate,
            scope: scopeInfo,
            notes: notesInfo,
          }
        });
      } else {
        await prisma.sisterCity.create({
          data: {
            cityName: cityName,
            countryName: countryName,
            flagEmoji: city.flag || '🌍',
            logoUrl: logoUrl,
            protocolDate: city.year || '2024',
            scope: scopeInfo,
            notes: notesInfo,
            status: 'ACTIVE',
          }
        });
      }
    }
    console.log('✅ Sister cities successfully synchronized with logos and dossiers!');
  }

  // 2. ÜYE BİRLİKLER (16 ADET)
  const birlikMod = osgeda.modules.find(m => m.id === 'uye_birlikler');
  if (birlikMod && birlikMod.sub_items) {
    console.log(`Processing ${birlikMod.sub_items.length} municipal unions...`);
    for (const b of birlikMod.sub_items) {
      const existing = await prisma.networkMembership.findFirst({
        where: { name: { contains: b.short_name || b.name } }
      });

      const desc = [
        b.details ? b.details.slice(0, 300) : b.name,
        b.contact ? `\nTemsil & İletişim: ${b.contact}` : '',
        b.opportunities ? `\nFırsatlar: ${b.opportunities}` : '',
      ].filter(Boolean).join('');

      if (!existing) {
        await prisma.networkMembership.create({
          data: {
            name: b.name,
            description: desc,
            status: 'ACTIVE',
            joinedYear: 2020,
          }
        });
      } else {
        await prisma.networkMembership.update({
          where: { id: existing.id },
          data: {
            name: b.name,
            description: desc,
          }
        });
      }
    }
    console.log('✅ Municipal unions successfully updated!');
  }

  // 3. ÇAĞRI VE HİBE RADARI (36 ADET GERÇEK FON ÇAĞRISI)
  const cagriMod = osgeda.modules.find(m => m.id === 'cagri_arama');
  if (cagriMod && cagriMod.sub_items) {
    console.log(`Processing ${cagriMod.sub_items.length} open grant calls...`);

    // Ensure parent funding programs exist
    let progHorizon = await prisma.fundingProgram.findFirst({ where: { code: 'HORIZON-EU' } });
    if (!progHorizon) {
      progHorizon = await prisma.fundingProgram.create({
        data: { name: 'Horizon Europe (Ufuk Avrupa)', code: 'HORIZON-EU', provider: 'Avrupa Komisyonu' }
      });
    }

    let progEurocities = await prisma.fundingProgram.findFirst({ where: { code: 'EUROCITIES' } });
    if (!progEurocities) {
      progEurocities = await prisma.fundingProgram.create({
        data: { name: 'Eurocities & Şehir Ağları Destekleri', code: 'EUROCITIES', provider: 'Eurocities / AB EaSI' }
      });
    }

    let progBebka = await prisma.fundingProgram.findFirst({ where: { code: 'BEBKA' } });
    if (!progBebka) {
      progBebka = await prisma.fundingProgram.create({
        data: { name: 'BEBKA & Kalkınma Ajansı Destekleri', code: 'BEBKA', provider: 'Sanayi ve Teknoloji Bakanlığı / BEBKA' }
      });
    }

    let progErasmus = await prisma.fundingProgram.findFirst({ where: { code: 'ERASMUS' } });
    if (!progErasmus) {
      progErasmus = await prisma.fundingProgram.create({
        data: { name: 'Erasmus+ & Gençlik Programları', code: 'ERASMUS', provider: 'Avrupa Komisyonu / Türkiye Ulusal Ajansı' }
      });
    }

    let progIlbank = await prisma.fundingProgram.findFirst({ where: { code: 'ILBANK' } });
    if (!progIlbank) {
      progIlbank = await prisma.fundingProgram.create({
        data: { name: 'İLBANK & Uluslararası Finansman Kredileri', code: 'ILBANK', provider: 'İller Bankası / Dünya Bankası / JICA' }
      });
    }

    for (const call of cagriMod.sub_items) {
      let programId = progHorizon.id;
      if (call.portal && (call.portal.includes('Eurocities') || call.name.includes('Eurocities'))) {
        programId = progEurocities.id;
      } else if (call.portal && (call.portal.includes('BEBKA') || call.name.includes('BEBKA') || call.name.includes('Kalkınma'))) {
        programId = progBebka.id;
      } else if (call.portal && (call.portal.includes('Erasmus') || call.name.includes('Erasmus'))) {
        programId = progErasmus.id;
      } else if (call.portal && (call.portal.includes('İLBANK') || call.name.includes('Kredi') || call.name.includes('Finansman'))) {
        programId = progIlbank.id;
      }

      // Check if call already exists by title
      const existingCall = await prisma.fundingCall.findFirst({
        where: { title: call.name }
      });

      let parsedDeadline = null;
      if (call.deadline) {
        // e.g. "04 Aralık 2026", "2026-12-04"
        const d = new Date(call.deadline);
        if (!isNaN(d.getTime())) parsedDeadline = d;
      }

      const notesContent = [
        call.status ? `Durum: ${call.status}` : null,
        call.urgency_tier ? `Öncelik Seviyesi: ${call.urgency_tier}` : null,
        call.evaluator_panel ? `Değerlendirme Puanı: ${call.evaluator_panel.total_score}/100 (${call.evaluator_panel.grade})` : null,
        call.evaluator_panel?.verdict ? `Uzman Görüşü: ${call.evaluator_panel.verdict}` : null,
        call.details || null,
        call.expert_tip ? `Uzman Tavsiyesi: ${call.expert_tip}` : null,
      ].filter(Boolean).join('\n\n');

      if (existingCall) {
        await prisma.fundingCall.update({
          where: { id: existingCall.id },
          data: {
            callCode: call.code,
            budgetInfo: call.budget,
            eligibility: call.eligible_role,
            sourceUrl: call.portal_url,
            notes: notesContent,
            deadline: parsedDeadline || existingCall.deadline,
          }
        });
      } else {
        await prisma.fundingCall.create({
          data: {
            fundingProgramId: programId,
            title: call.name,
            callCode: call.code || 'CALL-2026',
            budgetInfo: call.budget || 'Belirtilmedi',
            eligibility: call.eligible_role || 'Belediye / Ortak',
            sourceUrl: call.portal_url || null,
            notes: notesContent,
            deadline: parsedDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }
        });
      }
    }
    console.log('✅ 36 open grant calls successfully synchronized!');
  }
}

main()
  .catch(err => {
    console.error('Error during OSGEDA seeding:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
