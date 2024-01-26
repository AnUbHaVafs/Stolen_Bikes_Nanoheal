# Bike theft resolution project

Stolen bikes are a typical problem in Berlin. The Police want to be more efficient in resolving stolen bike cases. They decided to build a software that can automate their processes — the software that you're going to develop.

## Product Implementations

- list of reported bike thefts for the Berlin area.
- See first 10 bike theft cases, with the ability to - paginate (10 cases per page).
- See a total number of bike theft cases.
- filter reported bike thefts by partial case title.
- see a loading state until the list is available.
- see an error state if the list is unavailable.
- see an empty state if there are no results.
  
For each reported bike theft I want to see:
- Case title
- Case description
- Date of the theft
- Date of when the case was reported
- Location of the theft
- Picture of the bike, if available

## Technologies

- React
- TypeScript
- Code Linter: ESLint
- MUI
- E2E Tests: Cypress


Covered Edge-cases: 

```js
const fetchStolenBikesUsingQuery = async (userQuery:string)=>{
    const urlOptions: UrlOptions = {
      location: "Berlin",
      distance: 10,
      stolenness: "stolen",
      query: userQuery,
    };
    // set loader
    setShowLoader({ text: "loading ...", isLoading:true });
    setShowNoResults({ text: "", areNoResults: false });
    setShowError({ text: "", isError: false });
    
    const updatedStolenBikes = await getBikesThefts(urlOptions);
    
    // error handling
    if(updatedStolenBikes?.error){
      setShowError({text:"Ooops, something went wrong!", isError:true});
      setShowNoResults({ text: "", areNoResults: false });
      setShowLoader({ text: "", isLoading: false });
      setStolenBikesArr([]);
      setTotalBikesCount(0);
      setTotalPage(0);
      setCurrPage(0);
      return;
    }
    const newStolenBikesArr:StolenBikes[] = updatedStolenBikes?.bikes;
    const stolenBikesCount:number = newStolenBikesArr.length;
    // no results
    if (!isArrayWithLength(newStolenBikesArr)) {
      setShowNoResults({ text: "No Results!", areNoResults: true });
      setShowError({ text: "", isError: false });
      setShowLoader({ text: "", isLoading: false });
      setStolenBikesArr([]);
      setTotalBikesCount(0);
      setTotalPage(0);
      setCurrPage(0);
      return;
    }
    // data
    setStolenBikesArr(newStolenBikesArr);
    setTotalBikesCount(stolenBikesCount);
    setTotalPage(Math.ceil(stolenBikesCount / 10)); // per_page = 10 
    setCurrPage(1);
    if (isArrayWithLength(updatedStolenBikes.bikes)){
      setShowLoader({ text: "", isLoading: false });
    }
    return;
  };
```

E2E tests: 

```js

/// <reference types="cypress" />

describe('template spec', () => {
  it('all components exists', () => {
    cy.visit('http://localhost:5173/');
    cy.get('[data-testid=header-logo]').should('exist');
    cy.get('[data-testid=header-title]').should('exist');
    cy.get('[data-testid=header-sub-title]').should('exist');

    cy.get('[data-testid=case-description-input]').should('exist');
    cy.get('[data-testid=find-cases-submit-button]').should('exist');
    cy.get('[data-testid=pagination]').should('exist');
    cy.get('[data-testid=cases-count]').should('exist');

    cy.get('[data-testid=case-card-title]').should('exist');
    cy.get('[data-testid=case-card-description]').should('exist');
    cy.get('[data-testid=case-card-info]').should('exist');

  })

  it('loader exists', () => {
    cy.visit('http://localhost:5173/');
    cy.get('[data-testid=case-description-input]').should('exist');

    // loader exists
    cy.get('[data-testid=case-description-input]').type("202");
    cy.contains("loading");
    // results
    cy.get('[data-testid=cases-count]').should('exist');
    cy.get('[data-testid=case-card-title]').should('exist');
    cy.get('[data-testid=case-card-description]').should('exist');
    cy.get('[data-testid=case-card-info]').should('exist');

  })

  it('no results exists', () => {
    cy.visit('http://localhost:5173/');
    cy.get('[data-testid=case-description-input]').should('exist');

    // no results exists
    cy.get('[data-testid=case-description-input]').type("check for no results");
    cy.contains("loading");
    // cy.contains("No Results");

  })

  it('user queries responses exists', () => {
    cy.visit('http://localhost:5173/');
    cy.get('[data-testid=case-description-input]').should('exist');
    // user search query = "202"
    cy.get('[data-testid=case-description-input]').type("202");
    cy.contains("loading");

    // results
    cy.get('[data-testid=cases-count]').should('exist');
    cy.get('[data-testid=case-card-title]').should('exist');
    cy.get('[data-testid=case-card-description]').should('exist');
    cy.get('[data-testid=case-card-info]').should('exist');

  })
})

```
## WEB and Mobile UIs

Mobile UI: 

![Screenshot (2545)](https://github.com/AnUbHaVafs/Stolen_Bikes_Nanoheal/assets/76126067/f1d5e038-30a4-4ee8-8868-9a1a02f67442)

![Screenshot (2544)](https://github.com/AnUbHaVafs/Stolen_Bikes_Nanoheal/assets/76126067/7ea4618e-22c9-4c6c-9c45-230952f7a2e3)

![Screenshot (2546)](https://github.com/AnUbHaVafs/Stolen_Bikes_Nanoheal/assets/76126067/c5d8442c-b939-4f5c-abac-53750325a1fb)


Web UI:

![Screenshot (2503)](https://github.com/AnUbHaVafs/Stolen_Bikes_Nanoheal/assets/76126067/fa83d399-6c15-45c9-aa1e-5c27751cf2e7)

![Screenshot (2502)](https://github.com/AnUbHaVafs/Stolen_Bikes_Nanoheal/assets/76126067/a6372683-e00d-40f3-bea3-efda27cbfe74)

![Screenshot (2500)](https://github.com/AnUbHaVafs/Stolen_Bikes_Nanoheal/assets/76126067/a471ea1d-fb26-4a84-ab43-b6f1fbc8604b)

Cypress test cases passed results:

![Screenshot (2554)](https://github.com/AnUbHaVafs/Stolen_Bikes_Nanoheal/assets/76126067/0ed89cd4-802d-46ba-8540-146cf5c5c2c9)
