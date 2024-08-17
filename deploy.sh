# Build
rm -rf dist/
npm install
npx ng build

git checkout --orphan gh-pages
git rm -rf .
cp -r dist/lastfm-weeder/browser/* .
git add ./*.js ./*.css ./*.ico ./*.html ./*.json
