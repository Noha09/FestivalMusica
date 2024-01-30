const { src, dest, watch, parallel } = require('gulp'); // Importamos gulp

// CSS
const sass = require('gulp-sass')(require('sass')); // Importamos sass
const plumber = require('gulp-plumber'); // Importamos plumber
const autoprefixer = require('autoprefixer'); // Importamos autoprefixer
const cssNano = require('cssnano'); // Importamos cssnano
const postcss = require('gulp-postcss'); // Importamos postcss
const sourceMaps = require('gulp-sourcemaps'); // Importamos sourceMaps

// JS
const terser = require('gulp-terser-js'); // Importamos terser

// Img
const cache = require('gulp-cache'); // Importamos cache
const imgmin = require('gulp-imagemin'); // Importamos imagemin
const webp = require('gulp-webp'); // Importamos webp
const avif = require('gulp-avif'); // Importamos avif

function css(done) {
    src('src/scss/**/*.scss') // Identificamos el archivo que queremos procesar (SASS)
        .pipe( sourceMaps.init() ) // Inicializamos los sourceMaps
        .pipe( plumber() ) // Evitamos que gulp se detenga si hay un error en el código
        .pipe(sass()) // Compilamos el archivo
        .pipe(postcss([autoprefixer(), cssNano()])) // Agregamos los prefijos y minificamos el archivo
        .pipe( sourceMaps.write('.') ) // Escribimos los sourceMaps
        .pipe( dest('build/css') ); // Almacenar en el disco duro (o de estado solido)
    done(); // Callback que avisa a gulp cuando llegamos al final de la tarea
}

function imagenes(done) {
    const opciones = {
        optimizationLevel: 3
    };
    src('src/img/**/*.{jpg,png}')
        .pipe( cache( imgmin(opciones) ) ) // Optimizar las imágenes
        .pipe( dest('build/img') );
    done();
}

function versionWebp(done) {
    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{jpg,png}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'));
    done();
}

function versionAvif(done) {
    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{jpg,png}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'));
    done();
}

function javascript(done) {
    src('src/js/**/*.js')
        .pipe( sourceMaps.init() )
        .pipe(terser())
        .pipe( sourceMaps.write('.') )
        .pipe( dest('build/js') );
    done();    
}

function dev(done) {
    watch('src/scss/**/*.scss', css); // Vigilar cambios en los archivos
    watch('src/js/**/*.js', javascript);
    done();    
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev =parallel(imagenes, versionWebp, versionAvif, javascript, dev); // Ejecutar las tareas en paralelo

// Recordar que para ejecutar las tareas, debemos utilizar los siguientes comandos: npx gulp dev o npm run dev