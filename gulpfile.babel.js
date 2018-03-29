import gulp from 'gulp';
import postcss from 'gulp-postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import purgecss from 'gulp-purgecss';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import plumber from 'gulp-plumber';

const PATHS = {
  assets: './assets',
  css: './src/css/**/*',
  config: './src/tailwind.js',
  cssDist: './dist/css',
  dist: './dist',
  views: './src/views/**/*',
};

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g) || [];
  }
}

gulp.task('css', () => {
  return gulp.src('./_css/tailwind.css')
    .pipe(plumber())
    .pipe(postcss([
      tailwindcss('./tailwind.js'),
      autoprefixer
    ]))
    .pipe(rename('styles.css'))
    .pipe(gulp.dest('./assets'));
});

gulp.task('build-css', () => {
  return gulp.src('./_css/tailwind.css')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(postcss([
      tailwindcss(PATHS.config),
      autoprefixer
    ]))
    .pipe(purgecss({
      content: [`${PATHS.dist}**/*.html`],
      extractors: [
        {
          extractor: TailwindExtractor,
          extensions: ["html", "js"]
        }
      ]
    }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets'));
});

gulp.task('build', ['build-css']);

gulp.task('default', ['css'], () => {
  gulp.watch([PATHS.css], ['css']);
});
