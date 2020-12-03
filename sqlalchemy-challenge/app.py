import numpy as np
import pandas as pd
from datetime import datetime

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

import datetime as dt

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Measurement = Base.classes.measurement
Station = Base.classes.station



app = Flask(__name__)

@app.route("/")
def home():
    return (
        f"Welcome to climate app!<br/>"
        f"Available Routes:</br>"
        f"/api/v1.0/precipitation</br>"
        f"/api/v1.0/stations</br>"
        f"/api/v1.0/tobs</br>"
        f"/api/v1.0/<start></br>"
        f"/api/v1.0/<start>/<end></br>"
    )
@app.route("/api/v1.0/precipitation")
def climate_precipitation ():
    session = Session(engine)
    latest_date=session.query(Measurement.date, func.max(Measurement.date)).scalar()

    date_format=datetime.strptime(latest_date, '%Y-%m-%d')

    year_ago= date_format - dt.timedelta(days=365.5)

    latest_year= session.query(Measurement.date,Measurement.prcp).\
        filter(Measurement.date >= year_ago).\
        order_by(Measurement.date).all()

    prcp=[]
    
    for record in latest_year:
        row={}
        row["date"]=record[0]
        row["precipitation"]=record[1]
        prcp.append(row)
    session.close()
    return jsonify (prcp)

@app.route("/api/v1.0/stations")
def stations():
    session = Session(engine)
    stations = session.query(Station.name, Station.station).all()

    station_list=[]
    for record in stations:
        row={}
        row["name"]=record[0]
        row["station"]=record[1]
        station_list.append(row)

    session.close()
    return jsonify(station_list)

@app.route("/api/v1.0/tobs") 
def tobs():
    session=Session(engine)
    latest_date=session.query(Measurement.date, func.max(Measurement.date)).scalar()

    date_format=datetime.strptime(latest_date, '%Y-%m-%d')

    year_ago= date_format - dt.timedelta(days=365.5)
    station_list= session.query(Measurement.station, func.count(Measurement.station)).\
        group_by(Measurement.station).\
        order_by(func.count(Measurement.station).desc()).all()
    active_station_id=station_list[0][0]
    date_tobs=session.query(Measurement.date, Measurement.tobs).\
        filter(Measurement.station==active_station_id).\
        filter(Measurement.date >= year_ago).all()
    
    date_temp=[]
    for record in date_tobs:
        row={}
        row["date"]=record[0]
        row["temperature"]=record[1]
        date_temp.append(row)
    
    session.close()
    return jsonify (date_temp)

@app.route("/api/v1.0/<start>")
def start_date(start):
    session=Session(engine)
    date_t = datetime(year=int(start[0:4]), month=int(start[4:6]), day=int(start[6:8]))

    Tfunc=session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
        filter(Measurement.date >=date_t).all()
    temp_func=[]
    for record in Tfunc:
        row={}
        
        row["Min Temperature"]=record[0]
        row["Avg Temperature"]=record[1]
        row["Max Temperature"]=record[2]
        temp_func.append(row)
    session.close()
    return jsonify(temp_func)

@app.route("/api/v1.0/<start>/<end>") 
def start_end (start,end):

    session=Session(engine)
    date_t_s = datetime(year=int(start[0:4]), month=int(start[4:6]), day=int(start[6:8]))
    date_t_e = datetime(year=int(end[0:4]), month=int(end[4:6]), day=int(end[6:8]))

    TDfunc=session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
        filter(Measurement.date >=date_t_s).\
        filter(Measurement.date <= date_t_e).all()
    temp_datefunc=[]
    for record in TDfunc:
        row={}
        
        row["Min Temperature"]=record[0]
        row["Avg Temperature"]=record[1]
        row["Max Temperature"]=record[2]
        temp_datefunc.append(row)
    session.close()
    return jsonify(temp_datefunc) 

if __name__=="__main__":
        app.run(debug=True)