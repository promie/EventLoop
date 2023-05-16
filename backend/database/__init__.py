# Package for handling database 

import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .db_models import Base
from .db_seed import *
from datetime import datetime


database_dir = os.path.abspath(os.path.dirname(__file__))
database_uri = f'sqlite:///{database_dir}/eventloop_db.db?check_same_thread=False'

engine = create_engine(database_uri, echo=False)

Session = sessionmaker(bind=engine)
session = Session()
 
    
# Function to initialise the database
def create_db():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    
    init_categories(session)
    init_status(session)
    init_users(session)
    init_events(session)
    init_bookings(session)
    init_reviews(session)
    init_event_noti(session)
    init_connections(session)
    session.close()
