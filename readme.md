## UCafe

npm install -g less
npm install -g bower
cd public
bower install
cd ..
composer install
composer update
php artisan migrate

## To change CSS, modify LESS files
cd public/app
lessc style.less > menu-styles.css
