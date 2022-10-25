
/* Global Variables */
let baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip='
// API Key
const apiKey = '&units=metric&appid=990c6fb6d852c83ec28dccda6daa36dd';

// Create a new date instance
let d = new Date();
let newDate = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();

//event listener on generate button
document.getElementById('generate').addEventListener('click', ()=> {
    const userZip = document.getElementById('zip').value;
	//clear fields
	document.getElementById('zip').value = "";
    const feeling = document.getElementById('feelings').value;
	document.getElementById('feelings').value = "";
	
   //api call
   getWeather(baseURL, userZip, apiKey)
   //chain promises
   .then((data)=>{
       //send data to the server
       postWeather('/add', {temp: data, date: newDate, feeling: feeling})
   })
   //update UI
   .then(()=>updateUI());
});

//api call method
const getWeather = async (baseURL, userZip, Key) => {
    //call the api with the url then wait for response
    const res = await fetch(`${baseURL + userZip}${Key}`)
    try{
        //get response 
        const receivedData = await res.json();
        const temp = receivedData.main.temp;
        const name = receivedData.name;
        return({temp: temp, name: receivedData.name})
    }
    //catch errors
    catch(error){
        console.log("error",error);
    }
}

//send to the server
const postWeather = async (url = '', data = {})=>{
    const res = await fetch(url, {
        method : 'POST',
        credentials : 'same-origin',
        headers : {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(data),
    });
    try{
        const returnedData = await res.json();
        console.log("data returned");
        console.log(returnedData);
        return(returnedData);
    }
    catch(error){
        console.log("error", error);
    }
}

//update the ui
const updateUI = async ()=> {
    const req = await fetch('/all');
    try{
        const updatedData = await req.json();
        document.getElementById('date').textContent = updatedData.date;
        document.getElementById('temp').textContent = updatedData.temp.name + " - " + updatedData.temp.temp + " °F";
        document.getElementById('content').textContent = updatedData.feeling;
    }
    catch(error){
        console.log("error", error);
    }
}
