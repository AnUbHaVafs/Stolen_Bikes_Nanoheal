# Bike theft resolution project

Stolen bikes are a typical problem in Berlin. The Police want to be more efficient in resolving stolen bike cases. They decided to build a software that can automate their processes — the software that you're going to develop.

## Product Implementations

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

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


