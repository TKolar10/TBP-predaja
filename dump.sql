create table if not exists specijalizacija
(
    idspecijalizacija serial      not null
        constraint specijalizacija_pkey
            primary key,
    naziv             varchar(50) not null
);

alter table specijalizacija
    owner to postgres;

create table if not exists vrsta_lijeka
(
    idvrsta serial      not null
        constraint vrsta_lijeka_pkey
            primary key,
    naziv   varchar(50) not null
);

alter table vrsta_lijeka
    owner to postgres;

create table if not exists lijek
(
    idlijek serial      not null
        constraint lijek_pkey
            primary key,
    naziv   varchar(50) not null,
    idvrsta integer     not null
        constraint lijek_idvrsta_fkey
            references vrsta_lijeka
);

alter table lijek
    owner to postgres;

create table if not exists grad
(
    idgrad serial      not null
        constraint grad_pkey
            primary key,
    ime    varchar(50) not null
);

alter table grad
    owner to postgres;

create table if not exists bolnica
(
    idbolnica serial      not null
        constraint bolnica_pkey
            primary key,
    naziv     varchar(50) not null,
    idgrad    integer
        constraint bolnica_idgrad_fkey
            references grad
);

alter table bolnica
    owner to postgres;

create table if not exists ljekarna
(
    idljekarna serial      not null
        constraint ljekarna_pkey
            primary key,
    naziv      varchar(50) not null,
    email      varchar(50) not null,
    lozinka    varchar(50) not null,
    idgrad     integer     not null
        constraint ljekarna_idgrad_fkey
            references grad
);

alter table ljekarna
    owner to postgres;

create table if not exists skladiste
(
    idljekarna integer not null
        constraint skladiste_idljekarna_fkey
            references ljekarna,
    idlijek    integer not null
        constraint skladiste_idlijek_fkey
            references lijek,
    kolicina   integer not null,
    constraint skladiste_pkey
        primary key (idljekarna, idlijek)
);

alter table skladiste
    owner to postgres;

create table if not exists lijecnik
(
    idlijecnik        serial      not null
        constraint lijecnik_pkey
            primary key,
    ime               varchar(50) not null,
    prezime           varchar(50) not null,
    god_rodenja       date        not null,
    oib               varchar(11) not null,
    email             varchar(50) not null,
    lozinka           varchar(50) not null,
    maxbrojpacijenata integer     not null,
    idspecijalizacija integer     not null
        constraint lijecnik_idspecijalizacija_fkey
            references specijalizacija,
    idbolnica         integer     not null
        constraint lijecnik_idbolnica_fkey
            references bolnica
);

alter table lijecnik
    owner to postgres;

create table if not exists pacijent
(
    idpacijent  serial      not null
        constraint pacijent_pkey
            primary key,
    ime         varchar(50) not null,
    prezime     varchar(50) not null,
    god_rodenja date        not null,
    oib         varchar(11) not null,
    email       varchar(50) not null,
    lozinka     varchar(50) not null,
    idlijecnik  integer
        constraint pacijent_idlijecnik_fkey
            references lijecnik
);

alter table pacijent
    owner to postgres;

create table if not exists recept
(
    idrecept   serial  not null
        constraint recept_pkey
            primary key,
    idlijecnik integer not null
        constraint recept_idlijecnik_fkey
            references lijecnik,
    idpacijent integer not null
        constraint recept_idpacijent_fkey
            references pacijent,
    lijekovi   text[],
    prepisan   date    not null,
    izdan      timestamp
);

alter table recept
    owner to postgres;

create table if not exists dan
(
    iddan integer     not null
        constraint dan_pkey
            primary key,
    naziv varchar(15) not null
);

alter table dan
    owner to postgres;

create table if not exists termin
(
    idtermin   serial not null
        constraint termin_pkey
            primary key,
    iddan      integer
        constraint termin_iddan_fkey
            references dan,
    vrijemod   time   not null,
    vrijemedo  time   not null,
    idlijecnik integer
        constraint termin_idlijecnik_fkey
            references lijecnik
);

alter table termin
    owner to postgres;

create table if not exists narucivanje
(
    idnarucivanje serial not null
        constraint pokusaj_pkey
            primary key,
    idtermin      integer
        constraint pokusaj_idtermin_fkey
            references termin,
    datum         date,
    idpacijent    integer
        constraint pokusaj_idpacijent_fkey
            references pacijent,
    promijena     integer
);

alter table narucivanje
    owner to postgres;

create table if not exists pregled
(
    idpregled     serial not null
        constraint pregled_pkey
            primary key,
    idlijecnik    integer
        constraint pregled_idlijecnik_fkey
            references lijecnik,
    idpacijent    integer
        constraint pregled_idpacijent_fkey
            references pacijent,
    dijagnoza     text   not null,
    datumpregleda date   not null,
    recept        text[],
    izdan         timestamp,
    slika         oid,
    putanja       text
);

alter table pregled
    owner to postgres;

create or replace view terminipogled
            (idtermin, iddan, vrijemod, vrijemedo, idlijecnik, naziv, idnarucivanje, datum, idpacijent, promijena) as
SELECT t.idtermin,
       t.iddan,
       t.vrijemod,
       t.vrijemedo,
       t.idlijecnik,
       d.naziv,
       p.idnarucivanje,
       p.datum,
       p.idpacijent,
       p.promijena
FROM termin t
         RIGHT JOIN dan d ON t.iddan = d.iddan
         LEFT JOIN narucivanje p ON p.idtermin = t.idtermin
WHERE t.idtermin <> ((SELECT narucivanje.idtermin
                      FROM narucivanje
                      WHERE narucivanje.datum = '2022-02-07'::date)) AND p.datum <> '2022-02-07'::date
   OR p.datum IS NULL;

alter table terminipogled
    owner to postgres;

create or replace function proizvodnaskladistu() returns trigger
    language plpgsql
as
$$
begin
    if new.kolicina > 0 THEN
        return new;
    else
        return null;
    end if;

end;
$$;

alter function proizvodnaskladistu() owner to postgres;

create trigger triggerproizvodnaskladistu
    before insert or update
    on skladiste
    for each row
execute procedure proizvodnaskladistu();

create or replace function narucivanjeproizvoda() returns trigger
    language plpgsql
as
$$
declare
    broj integer := 1;
begin

    if new.kolicina < 10 then
        update skladiste set kolicina=new.kolicina + 30 where idlijek = new.idlijek and idljekarna = new.idljekarna;

    end if;
    return new;


end;
$$;

alter function narucivanjeproizvoda() owner to postgres;

create trigger triggernarucivanjeproizvoda
    after insert or update
    on skladiste
    for each row
execute procedure narucivanjeproizvoda();

create or replace function kontrolatermina() returns trigger
    language plpgsql
as
$$
declare
    zapis record;
begin
    for zapis in select iddan, vrijemod, vrijemedo, idlijecnik
                 from termin
                 where iddan = new.iddan
                   and idlijecnik = new.idlijecnik
        loop
            if (zapis.vrijemod = new.vrijemod or zapis.vrijemedo = new.vrijemedo) then
                return null;
            end if;
        end loop;
    return new;
end;
$$;

alter function kontrolatermina() owner to postgres;

create trigger triggerkontrolatermina
    before insert or update
    on termin
    for each row
execute procedure kontrolatermina();


