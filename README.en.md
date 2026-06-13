# Real-Time Hourly Wage Calculator

<h3 align="center">
  <a href="./README.md">中文 README</a>
</h3>

A small static web app for tracking today's working time, calculating hourly wage, and generating an end-of-day work summary.

Live site:

https://youks7.github.io/realtime-salary-calculator/

GitHub repository:

https://github.com/Youks7/realtime-salary-calculator

## Overview

This website calculates hourly wage information based on the user's monthly income and contracted daily working hours.

Its purpose is simple: start the timer when work begins, show how long you have worked today, calculate the standard hourly wage, calculate the current actual hourly wage, and display a summary when the workday ends.

The project is a pure front-end static site. It does not require a backend, database, account system, or build process.

## Features

- Enter a custom monthly income
- Enter custom contracted daily working hours
- Timer starts only after clicking "Start Work"
- Automatically opens ChatGPT when work starts
- Pause and resume work timing
- Automatically opens Douyin when clicking "Start Slacking"
- Show an end-of-day summary after clicking "Finish Work"
- Reset the timer with "New Day"
- Keep working time at `00:00:00` before work starts
- Use contracted working hours before the contracted time is reached, avoiding unrealistic hourly wage spikes at the beginning

## Calculation Logic

The app uses the common monthly paid working days value:

```text
21.75 days
```

Standard hourly wage:

```text
Standard hourly wage = Monthly income / 21.75 / Contracted working hours
```

Current actual hourly wage:

```text
Before work starts: 0
Before contracted hours are reached: Monthly income / 21.75 / Contracted working hours
After contracted hours are exceeded: Monthly income / 21.75 / Actual worked hours
```

Estimated monthly income on the result page:

```text
Estimated monthly income = Today's actual hourly wage * Contracted working hours * 21.75
```

## How To Use

1. Open the website.
2. Enter your monthly income.
3. Enter your contracted daily working hours.
4. Click "Start Work".
5. Click "Pause Work" when you need to pause the timer.
6. Click "Continue Work" to resume timing.
7. Click "Finish Work" when the workday ends.
8. Click "New Day" to reset the timer for another day.

## Project Structure

```text
.
├── index.html      Page structure
├── styles.css      Page styles
├── app.js          Timer, calculation, and button behavior
├── README.md       Chinese project documentation
└── README.en.md    English project documentation
```

## Run Locally

You can open `index.html` directly in a browser.

If the browser restricts popups or local file behavior, start a local static server in the project directory:

```powershell
python -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## Deployment

The project is deployed with GitHub Pages.

Publishing source:

```text
main branch / root directory
```

To update the live website after editing local files:

```powershell
git add .
git commit -m "Update site"
git push
```

GitHub Pages will rebuild and publish the latest version automatically.

## Notes

- The website is public. Anyone with the link can open it.
- Timer state is local to the current browser tab and does not sync across devices.
- Opening ChatGPT and Douyin depends on browser permission for user-triggered new tabs.
- If the browser blocks popups, allow this site to open new tabs.
