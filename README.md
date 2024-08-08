# Rentabilidades AFP

## Requiremnts

- Node >= 20.15.1

### Recomendations

- VS Code with this extensions:
  - Astro
  - Prettier

## Install and run the project locally

```bash
npm install
npm run dev
```

## Deploy

Depploy is done by github actions (deploy.yml) on push to main, workflow_run or workflow_dispatch.

## Data

The data updates automatically from a github action (scrap_site.yml) that runs the cron/index.js script. This will scrap the Superintendencia every 3 day of the month, update the data files and the redeploy the project.

## Technologies

- [Astro](https://astro.build/) as the main framework.
- [Solid](https://www.solidjs.com/) for interactivity front-end.
- [Chart.js](https://www.chartjs.org/docs/latest/) to show data.
- [Typescript](https://www.typescriptlang.org/) for type safesty.
- [Cheerio](https://cheerio.js.org/) to scrap the data.
