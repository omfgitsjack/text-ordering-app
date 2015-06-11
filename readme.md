## UCafe
 - Mobile & Desktop friendly, simple UI
 - Food CRUD [To be added]
 - Orders made through web interface, confirmation through 2 factor authentication using Twilio
 - All order updates sent through SMS
 - WeChat integration [To be added]
 - Export data into CSV [To be added]
 - Admin portal  
 - Real-time customer messaging/bulk messaging [To be added]

## Front-end setup
npm install -g less  
npm install -g bower  
cd public  
bower install  
cd ..  
## Back-end setup, start at root.
composer install  
composer update  
php artisan migrate  

## To change CSS, modify LESS files
cd public/app  
lessc style.less > menu-styles.css
