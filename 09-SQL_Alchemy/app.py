import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, and_

from flask import Flask, jsonify


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

#app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///DB/Traffic_Data_db.sqlite"


# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"<br/>/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0/start<br/>"
        f"/api/v1.0/start/end"

    )


@app.route("/api/v1.0/precipitation")
def precipitation():
    """Return a list of all prcp"""
    # Query all tobs
    results = session.query(Measurement.date, Measurement.prcp).filter(Measurement.date>='2016-08-24').all()

    #all_names = list(np.ravel(results))
    all_prcps = []

    prcps_dict = {}
    for row in results:
        
        prcps_dict[row.date] = row.prcp        
        
        #all_temps.append(temps_dict)

    return jsonify(prcps_dict)



@app.route("/api/v1.0/stations")
def stations():
    """Return a list of stations from the dataset"""
    # Query all passengers
    results = session.query(Station.station).all()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_stations = []
    for row in results:
        #print(row.station)
        all_stations.append(row.station)

    return jsonify(all_stations)

@app.route("/api/v1.0/tobs")
def tobs():
    """Return a list of all tobs"""
    # Query all tobs
    results = session.query(Measurement.date, Measurement.tobs).filter(Measurement.date>='2016-08-24').all()

    #all_names = list(np.ravel(results))
    all_temps = []

    temps_dict = {}
    for row in results:
        
        temps_dict[row.date] = row.tobs        
        
        #all_temps.append(temps_dict)

    return jsonify(temps_dict)


@app.route("/api/v1.0/<start>")
def start_date(start):
    """Return a JSON list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end range."""
    """When given the start only, calculate TMIN, TAVG, and TMAX for all dates greater than and equal to the start date."""
    
    # Query all tobs
    results = session.query(Measurement.date, Measurement.tobs).filter(Measurement.date>=start).all()

    #all_names = list(np.ravel(results))
    
    all_temps = []
    for row in results:
        print(row.tobs)
        all_temps.append(row.tobs)

    #print(all_temps)
    maxminavg_temps = []
    maxminavg_temps.append(max(all_temps))
    maxminavg_temps.append(min(all_temps))
    maxminavg_temps.append(sum(all_temps)/len(all_temps))

    return jsonify(maxminavg_temps)

@app.route("/api/v1.0/<start>/<end>")
def start_end_date(start, end):
    """Return a JSON list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end range."""
    """When given the start and the end date, calculate the TMIN, TAVG, and TMAX for dates between the start and end date inclusive."""
    # Query all passengers
    results = session.query(Measurement.date, Measurement.tobs).filter(and_((Measurement.date>=start),(Measurement.date<=end))).all()

    all_temps = []
    for row in results:
        print(row.tobs)
        all_temps.append(row.tobs)

    #print(all_temps)
    maxminavg_temps = []
    maxminavg_temps.append(max(all_temps))
    maxminavg_temps.append(min(all_temps))
    maxminavg_temps.append(sum(all_temps)/len(all_temps))

    return jsonify(maxminavg_temps)

    
if __name__ == '__main__':
    app.run(debug=True)
