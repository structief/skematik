cd images/public
gulp prod
cd ../
cp ./public/index.html ./server/src/index.html
cp ./public/.htaccess ./server/src/.htaccess
cp -R ./public/assets/ ./server/src/
cp -R ./public/application/ ./server/src/application/

cd ../
docker-compose up --build -d
