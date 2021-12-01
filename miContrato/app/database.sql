drop database if exists gobchain;
create database gobchain;
use gobchain;

create table catalogo_dependencia(
    dependenciaid smallint NOT NULL auto_increment,
    dependencia varchar(100) NOT NULL,
    PRIMARY KEY(dependenciaid)
);
create table users(
    userid varchar(25) NOT NULL,
    nombre varchar(25) NOT NULL,
    paterno varchar(25) NOT NULL,
    materno varchar(25),
    dependenciaid smallint,
    API_KEY varchar(64) NOT NULL UNIQUE,
    PRIMARY KEY(userid),
    FOREIGN KEY (dependenciaid) REFERENCES catalogo_dependencia(dependenciaid)
);
-- Creación del catalogo_dependencia
insert into catalogo_dependencia(dependencia) values ('Secretaría de la Contraloría'),
    ('Secretaría de Turismo'),('Consejería Jurídica y de Servicios Legales'),('Procuraduria General de Justicia'),
    ('Secretaria de Administración y Finanzas'),('Secretaría de Cultura'),
    ('Secretaría de Desarrollo Urbano y Vivienda'),('Secretaría de Educación, Ciencia, Tecnología e Innovación'),
    ('Secretaría de Gobierno'),('Secretaria de Inclusión y Bienestar Social'),
    ('Secretaría de las Mujeres'),('Secretaría del Medio Ambiente'),
    ('Secretaría de Movilidad'),('Secretaría de Obras y Servicios'),
    ('Secretaria de Protección Civil y Gestión Integral de Riesgos'),
    ('Secretaría de Pueblos y Barrios Originarios y Comunidades Indigenas Residentes'),
    ('Secretaría de Salud'),('Secretaría de Seguridad Ciudadana'),
    ('Secretaría de Trabajo y Fomento al Empleo')
