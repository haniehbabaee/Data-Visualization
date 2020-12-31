from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo 
import pymongo
import scrape_mars

app=Flask(__name__)


mongo=PyMongo(app, uri='mongodb://localhost:27017/mars_db')


@app.route("/")
def home():
    new_data=mongo.db.mars.find_one()
    
    print(new_data)
    # if new_data:
    #     return render_template("index.html", data=new_data)
    # else:
    #     return render_template("default.html")
    return render_template("index.html", data=new_data)


@app.route("/scrape")
def scrape():
    mars_data = scrape_mars.scrape_all()
    mongo.db.mars.update({}, mars_data, upsert=True)

    # Redirect back to home page
    return redirect("/")


if __name__=="__main__":
    app.run(debug=True)