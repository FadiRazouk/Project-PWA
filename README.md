# how to run tests
```
git clone https://github.com/FadiRazouk/Project-PWA
cd Project-PWA
npm install
npx cypress open (to open ui)
npx cypress run (to run all the tests)
```
# Recommended way to run the tests is inside a docker image and here is how (must have docker installed)

```
git clone https://github.com/FadiRazouk/Project-PWA
cd Project-PWA
docker run -it -v $PWD:/e2e -w /e2e cypress/included:10.10.0
```

# (temporary) to test mobile you need to change some config in Cypress.config.ts

change from:
```
  viewportWidth: 1387,
  viewportHeight: 764,
  ```
to:
```
  viewportWidth: 390,
  viewportHeight: 844,
```
and isMobile from :

```
false to true
```

# here is the latest cicd run for the tests in parallel

https://github.com/FadiRazouk/Project-PWA/actions/runs/3302814993/jobs/5450030348

useing 5 machine is definitely an overkill at this moment but its just for demonstration purposes
i was able to cut down run time by 300% from 3min to 1min.

# Visual testing
cypress-image-diff is used to test the visuals of the website, as first time running it will only take baseline image and what ever runs after that it will compare newly created screenshots to the base line

for more info please visit https://github.com/uktrade/cypress-image-diff