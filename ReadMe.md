# Rentux Website Layout

### Front End is hosted on Netlify: https://rentuxsample.netlify.app

### Back End is hosted on Heroku: https://rentuxsample.herokuapp.com

<br>

> Heroku server sleeps if [inactive for 30 mins]( https://devcenter.heroku.com/articles/free-dyno-hours#dyno-sleeping ) & then takes about 5-10 seconds to load when requested <br>
so if the Front End doesn't load data immediately then don't panic

<br>

``` 
             _____________________________  Website ______________________________
            │                                                                     │ 
            │                                                                     │ 
            │                                                                     │ 
            │                                                                     │
            │                (requests data)             (when modified           │
     ───────────>          ──────────────────>            Data is Bkup)           │
User        |      NETLIFY                      HEROKU  ─────────────────> GitHub |
     <───────────          <──────────────────    ᐱ                               │
            │                  (sends data)       │                               │
            │                                     │                               │
            │                                     │                               │
            │                                     │ (modify data)                 │
            │                                     │                               │
            │                                     │                               │
            │                                     │                               │
            │                                   Admin                             │
            │                                                                     │
            │_____________________________________________________________________│

```
Further explaination is given in subsequent folders . . .

<br>

# QnA

## **Why not only use Heroku as a fullstack?**
<br>

Like I mentioned above, heroku sleeps after inactivity of 30 mins so if I was to use heroku as a full stack, the main page would take time to load whereas now (with netlify) the front page loads immediately and **then** waits for the data to be fetched.

Also Netlifys CDNs are much faster and provides decenteralization i.e. If heroku fails netlify can still host the front end and display the error that `'The servers are currently down'`.

<br>

## **Why did you store data in .JSON files instead of using a database?**
<br>

The site currently does not store that much data and using a database would be overkill **but** I have left the option of a database like `MongoDB` (or whichever you prefer) to be integrated if required in the future.

<hr>

## **References**

I've used [The Net Ninja](https://www.youtube.com/c/TheNetNinja) channel as a reference 

so if you are unfimilar with `node.js`, `react.js`, etc use the channel as a guide or reminder.

<br>

>**Note to future developer(s):**<br><br>
> Rentux has a lot of potential and if executed properly it will definitely be in the big leagues.<br> So keep that in mind as you develop their website & have fun : )<br><br>
>-by Manas Ravindra Makde