# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## **[0.9.0]** - 2023-03-09

### **Added**

- Player update stats action in players list
- Meta tags
- Mode distribution chart in crash realtime
- Navbar icons moved inside menu button for mobile
- Separator for values inside stats board
- Game stats in crash real time
- 'Last bet at' column in launches list
- Players online status badge

### **Fixed**

- Mobile UI
- Update date button of time range selector
- Bets report mobile UI
- Players in ranks list
- Sort players by PL in bets and players list
- Time range selector and crash dashboard mobile UI
- Replace actions button with icon button
- Crash realtime UI
- Show data grid for mobile
- Disable zoom for iPhone

### **Removed**

- Players ID and display name from bets list inside player details page

---

## **[0.8.9]** - 2023-03-07

### **Added**

- Parsiga Stage DB

### **Fixed**

- Admin dashboard visibility before user logs in
- Status badge styles

---

## **[0.8.8]** - 2023-03-07

### **Added**

- Margin percent value next to PL amount
- Handle iframe in crash realtime bets
- Loading skeleton UI before data is fetched
- Yesterday, this week, and this month filters in time range selector
- Lucky wins ranking in crash dashboard
- Show full value when hovering over stats
- Show admin portal version only for admin users
- Connect rankings data with time range selector in crash dashboard
- Close connections from player api
- Cash in and Cash out api

### **Fixed**

- Exclude cancel bets from reports
- Online players in crash dashboard
- Fetch win odds from database and fix sorting
- Rollback last bet and closed connections
- Loading crash dashboard on safari
- Granularity for charts in crash dashboard
- Scrollbar CLS and navbar in mobile
- Form inside filters button component
- Hide last min, last 5 mins, last 30 mins, last 1 hour, last 2 hours from time range selector in crash dashbaord
- Crash realtime in online players
- Line chart labels
- Date selector in dashboard
- End date in time range selector
- Display name link in launches list
- DB names in logs and launches list
- Online players in crash dashboard

### **Remove**

- Empty stats boards

---

## **[0.8.7]** - 2023-03-04

### **Added**

- Connect websocket
- Margin percent value for total bets in crash dashboard

### **Fixed**

- Lists layout and spacing
- Crash point colors
- Update line chart
- Logo for light themes

---

## **[0.8.6]** - 2023-03-04

### **Fixed**

- Format time of stats chart in crash dashboard

---

## **[0.8.5]** - 2023-03-04

### **Fixed**

- Bets distribution chart in crash dashboard

---

## **[0.8.4]** - 2023-03-04

### **Added**

- Big losses, high rollers and latest wins list ranking in crash dashboard
- Show full value of total bets in stats board

### **Fixed**

- Big wins
- Currency in stats board

---

## **[0.8.3]** - 2023-03-03

### **Added**

- Total bets in crash dashboard

---

## **[0.8.2]** - 2023-03-03

### **Added**

- Crash point and cashier ID in bets list
- Total bets in crash dashboard

### **Fixed**

- Logs and launches list when limit pagination is 100
- Lists layout

---

## **[0.8.1]** - 2023-03-03

### **Added**

- Logs for player details list

### **Fixed**

- Round details
- Players list
- Search bets in players list
- Use Next.js Link component in bets list
- Players & bets sorting after search
- Default date to today
- Last 30 days

---

## **[0.8.0]** - 2023-03-03

### **Added**

- Link round index cells to round details page
- Total stats for players list
- Hour for play time in format in launches list

### **Fixed**

- Date format and players details
- More filters button in player logs and player list - logs tab
- Default time range to last day

---

## **[0.7.9]** - 2023-03-03

### **Added**

- Hide inactive players filter in players list
- Hide closed launches in launches list

### **Fixed**

- DBs in launches list
- Use bet id for search field in player detail's bets list
- Operator currency when changing operator ID
- Currency symbol in stats

---

## **[0.7.8]** - 2023-03-02

### **Added**

- Round details page
- Filters for bets and rounds in player details page
- iframe in crash realtime bets

### **Fixed**

- Launches api
- Sort by last activity for players list
- Bets report
- Update stats format

### **Removed**

- Hashtag from rounds index number

---

## **[0.7.7]** - 2023-03-02

### **Added**

- Favicon and logo in login page
- Access to changelog in navbar
- PL in player details page

### **Fixed**

- Players logs list and players bets list

---

## **[0.7.7]** - 2023-03-02

### **Added**

- Favicon and logo in login page
- Access to changelog in navbar
- PL in player details page

### **Fixed**

- Players logs list and players bets list

---

## **[0.7.6]** - 2023-03-01

### **Added**

- Hover effect to list
- Win odds column in bets list
- Filter launches by Cashier ID

### **Fixed**

- Rename round number to round index

---

## **[0.7.5]** - 2023-03-01

### **Added**

- Move Operator and DB dropdowns to navbar

### **Fixed**

- Update data grid height
- Format play time in launches list

### **Removed**

- Default alert component in login page

---

## **[0.7.4]** - 2023-02-28

### **Added**

- Min and max crash point filters in rounds list
- Styles for status in launches list

### **Fixed**

- Use Next.js Link component instead of MUI component
- Base URL
- Update currency format for IRT
- Auto refresh
- Sorting for all rounds list
- Sorting for launches list
- DB names in logs list
- Time in launches list

### **Removed**

- Back arrow

---

## **[0.7.3]** - 2023-02-27

### **Added**

- Last month as default date
- Launches api
- Number of bets and pl in launches list

### **Fixed**

- Rounds and launches list
- IRT currency in bets list
- Update crash point's badge colors
- Copy bet id in player details
- Change bet id oclor in bet details
- Linking text
- Sorting in launches list

---

## **[0.7.2]** - 2023-02-26

### **Added**

- Last 24hrs as default date

---

## **[0.7.1]** - 2023-02-26

### **Added**

- Bets report for player details

---

## **[0.7.0]** - 2023-02-26

### **Added**

- Report for player details

---

## **[0.6.9]** - 2023-02-26

### **Added**

- All launches & player details launches
- Filter launches list by dates

---

## **[0.6.8]** - 2023-02-25

### **Added**

- Switch between wss falcon & crash demo

---

## **[0.6.7]** - 2023-02-25

### **Added**

- Filter retries list by date created

---

## **[0.6.6]** - 2023-02-25

### **Added**

- Filter bets list by date created

---

## **[0.6.5]** - 2023-02-25

### **Added**

- JSON for retries list

---

## **[0.6.4]** - 2023-02-25

### **Added**

- Page titles in Crash module
- Successful and unsuccessful placed bets
- Last 2hrs and 6hrs filters on logs data

---

## **[0.6.3]** - 2023-02-25

### **Added**

- Crash realtime: Round index
- Successful and unsuccessful placed bets

---

## **[0.6.2]** - 2023-02-24

### **Added**

- Page titles in Crash module
- Crash realtime: Online players, Active bets & errors

---

## **[0.6.1]** - 2023-02-24

### **Added**

- Crash environments: Parsiga DBs
- Filter logs UI
- More filter logs (parquet)

### **Fixed**

- Search by bet id and player id logs
- Change date picker to 24hour format
- Copy value only on icon click

---

## **[0.6.0]** - 2023-02-23

### **Fixed**

- Auto refresh logs
- Logs (parquet)

---

## **[0.5.9]** - 2023-02-23

### **Added**

- Show canceled rounds filter in crash rounds list
- Last activity of player in crash player details page
- Copy values functionality
- Dollar currency symbol
- Use numeral.js for number formatting

### **Fixed**

- Hash in crash rounds list
- Body scrollbar CLS
- Improve list UI - Fix header on scroll
- Capitalize status badge
- Update bets logs layout
- Logs from (parquet)
- Logs refresh data

---

## **[0.5.8]** - 2023-02-21

### **Added**

- Add find round by Md5 filter in crash rounds list

### **Fixed**

- Update bet players components
- Hash and Md5 button styles

---

## **[0.5.8]** - 2023-02-20

### **Fixed**

- Update bet players components

---

## **[0.5.7]** - 2023-02-20

### **Added**

- UI for crash realtime module

### **Fixed**

- Crash dashboard CLS

---

## **[0.5.6]** - 2023-02-20

### **Added**

- Crash tester module
- Round index in crash tester module

---

## **[0.5.5]** - 2023-02-20

### **Fixed**

- Login page

---

## **[0.5.4]** - 2023-02-20

### **Fixed**

- Update path aliases

---

## **[0.5.3]** - 2023-02-20

### **Added**

- Get base url from environment

---

## **[0.5.2]** - 2023-02-20

### **Added**

- Loading icon for all lists in crash module
- Placeholder for min and max crash points
- Real time dashboard monitor

### **Removed**

- Hide theme button in all dashboards
- Percent badges in crash players module

---

## **[0.5.1]** - 2023-02-18

### **Fixed**

- Current round index when page is refreshed
- Move theme button inside admin profile

---

## **[0.5.0]** - 2023-02-18

### **Added**

- Separator for amount values
- Placeholder if time stamp is empty

### **Fixed**

- Return values for hash buttons
- Current round index when page is refreshed
- Alignment of list filters
- Date format

### **Removed**

- Auto-fill of login credentials
- Granularity from bet stat graph

---

## **[0.4.9]** - 2023-02-17

### **Fixed**

- Font color for dropdowns in light theme

---

## **[0.4.8]** - 2023-02-17

### **Fixed**

- Date format inside lists
- Move percent to right side of value

### **Removed**

- Badges from card in crash players

---

## **[0.4.7]** - 2023-02-17

### **Fixed**

- Font color for dropdowns in light theme

### **Removed**

- Badges from card in crash dashboard

---

## **[0.4.6]** - 2023-02-17

### **Added**

- Static bets in crash bets module
- Cancel filter of crash bets

### **Fixed**

- Fix decimal numbers in crash dashboard

### **Removed**

- Percent & time of crash bets

---

## **[0.4.5]** - 2023-02-17

### **Added**

- Get bet logs using bet created date

---

## **[0.4.4]** - 2023-02-16

### **Fixed**

- Fix routes from crash dashboard to player details

---

## **[0.4.3]** - 2023-02-16

### **Removed**

- Filter logs from bet details

---

## **[0.4.2]** - 2023-02-16

### **Added**

- Assign user to crash module

### **Fixed**

- Update language
- Change 'type' to 'mode' in crash bets module
- Change bet copy value from bet ref id to bet id

---

## **[0.4.1]** - 2023-02-15

### **Added**

- Farsi Translation for menu

---

## **[0.4.0]** - 2023-02-15

### **Fixed**

- Date in crash logs module
- Mobile responsiveness for logs UI

---

## **[0.3.9]** - 2023-02-14

### **Fixed**

- Crash bets module UI

---

## **[0.3.8]** - 2023-02-14

### **Added**

- Logs details in crash bets module
- Logs in crash rounds module

### **Fixed**

- Logs in bets module

---

## **[0.3.7]** - 2023-02-13

### **Added**

- Logs details in crash players module
- Logs in crash bets module
- Filter by player & bet id in crash logs module

### **Fixed**

- Improve timestamp in crash logs module

---

## **[0.3.6]** - 2023-02-13

### **Fixed**

- Crash dashboard
- Select players UI in crash

---

## **[0.3.5]** - 2023-02-13

### **Added**

- Filter logs list by range date in crash

### **Fixed**

- Crash logs module UI

---

## **[0.3.4]** - 2023-02-11

### **Added**

- Player logs in crash players module
- Filter logs list by severity, type, and subtype in crash page

---

## **[0.3.3]** - 2023-02-11

### **Added**

- Auto refresh bets every 10secs in bets module
- Crash logs list module

### **Fixed**

- Get stats of players in crash dashboard
- Geography of customers in websites dashboard

---

## **[0.3.2]** - 2023-02-08

### **Added**

- Stats of players in crash dashboard

---

## **[0.3.1]** - 2023-02-08

### **Fixed**

- Performance of graph in crash dashboard

---

## **[0.3.0]** - 2023-02-08

### **Added**

- Filter by date in main dashboard

---

## **[0.2.9]** - 2023-02-07

### **Added**

- Bets stats in crash dashboard
- Static operators in crash dashboard

### **Fixed**

- Base URL

---

## **[0.2.8]** - 2023-02-07

### **Added**

- Online players in crash dashboard

### **Fixed**

- Bets by players
- Online players
- Last wins
- Rare wins
- Top winners
- Big losers
- Most active players
- Geo players

---

## **[0.2.7]** - 2023-02-06

### **Fixed**

- Bet id
- Database UI

---

## **[0.2.6]** - 2023-02-06

### **Added**

- Player round and bets details in mobile

### **Fixed**

- Players api switch data
- Update operator name
- Default database

---

## **[0.2.5]** - 2023-02-04

### **Added**

- Dropdown UI for name database

---

## **[0.2.4]** - 2023-02-04

### **Added Crash Api**

- Get Current Crash Round.

---

## **[0.2.3]** - 2023-02-04

### **Added Crash Api**

- list of players.
- details of player.
- Player Rounds list.
- Player Bets list.
- Rounds list.
- Rounds details (List of bets by round).
- Bets list.
- Details of bet.
- Retries List.
- details of retry.
- operators list.
- get all crash data by operator id

---

## **[0.2.2]** - 2023-01-18

### **Added**

- CMS UI for Websites module

### **Removed**

- Base Image URL: Remove cookies

---

## **[0.2.1]** - 2023-01-17

### **Fixed**

- Improve token check: If user token is expired, reload data and log user out of account
- Update theme text color

---

## **[0.2.0]** - 2023-01-17

### **Added**

- Loader: Added for all pages before it's fully loaded

### **Fixed**

- Add Profile Link in quick navigation

---

## **[0.1.9]** - 2023-01-17

### **Added**

- Password Management: Add reset password for users, recovery link sent to email or recovery by code (#221)

---

## **[0.1.8]** - 2023-01-16

### **Added**

- 2 Factor Authentication: Users can now login with 2FA (#235)

---

## **[0.1.7]** - 2023-01-16

### **Added**

- User Documents: Allow users to upload documents into their account (#227)
