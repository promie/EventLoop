# -*- coding: utf-8 -*-
"""
[Program Name].py

This program was written vuho7
Created on Tue Oct 11 15:36:03 2022

[Program Summary]
"""
import os
import sys
import database.db_models as db
from flask import current_app
from core import f_bcrypt
from pathlib import Path
import csv
from datetime import datetime
import json
from sqlalchemy import and_

database_dir = Path('database')
data_subdir = database_dir/'data'


def read_csv_to_dict(filepath):
    with open(filepath, 'r', encoding="utf-8") as file:
        dict_reader = csv.DictReader(file)
        lst_dict = list(dict_reader)

    return lst_dict


# Function to prefill EventCategories table
def init_categories(session):
    session.add_all([db.EventCategories(name='Corporate'),
                     db.EventCategories(name='Fundraising'),
                     db.EventCategories(name='Conferences and Workshops'),
                     db.EventCategories(name='Virtual'),
                     db.EventCategories(name='Fandom'),
                     db.EventCategories(name='Festivals and Fairs'),
                     db.EventCategories(name='Food and Drink'),
                     db.EventCategories(name='Networking'),
                     db.EventCategories(name='Hackathons'),
                     db.EventCategories(name='Sports and Tournaments')
                     ])
    session.commit()


# Function to prefill EventStatus table
def init_status(session):
    session.add_all([db.EventStatus(name='Ticket Available'),
                     db.EventStatus(name='Sold Out'),
                     db.EventStatus(name='Finished'),
                     db.EventStatus(name='Postponed'),
                     db.EventStatus(name='Cancelled'),
                     ])
    session.commit()


# Function to populate users
def init_users(session):
    data = read_csv_to_dict(data_subdir/'users.csv')
    for item in data:
        # Hash the password
        password_bytes = f_bcrypt.generate_password_hash(item['password'], 11)
        password_hash = password_bytes.decode("utf-8")
        
        
        user = db.Users(email=item['email'],
                        password=password_hash,
                        first_name=item['first_name'],
                        last_name=item['last_name'],
                        birthday=datetime.fromisoformat(item['birthday']).date(),
                        billing_add=item['billing_add'],
                        billing_gps_coord=item['billing_gps_coord'],
                        photo_url=item['photo_url'],
                        website_url=item['website_url'],
                        about_me=item['about_me'],
                        interests=item['interests'],
                        home_add=item['home_add'],
                        home_gps_coord=item['home_gps_coord'],
                        phone=item['phone'],
                        gender=item['gender'],
                        matching_option=bool(int(item['matching_option'])))
        session.add(user)
    session.commit()


# Functions to populate events
def init_events(session):
    data = read_csv_to_dict(data_subdir/'events.csv')

    for index, item in enumerate(data):
        # Fetch category id from EventCategories table and place it in Events table
        category = session.query(db.EventCategories).filter_by(name=item['category']).first()
        category_id = category.id

        # Fetch status id from EventStatus table and place it in Events table
        status = session.query(db.EventStatus).filter_by(name=item['status']).first()
        status_id = status.id

        event = db.Events(title=item['title'],
                          description=item['description'],
                          created_by=int(item['created_by']),
                          category_id=category_id,
                          location_add=item['location_add'],
                          gps_coord=item['gps_coord'],
                          photo_url=item['photo_url'],
                          start_datetime=datetime.fromisoformat(item['start_datetime']),
                          end_datetime=datetime.fromisoformat(item['end_datetime']),
                          tags=item['tags'],
                          age_limit=int(item['age_limit']),
                          status_id=status_id)

        session.add(event)

        for ticket in json.loads(item['tickets']):
            if 'sold' in ticket.keys():
                sold_tickets = ticket['sold']
            else:
                sold_tickets = 0

            ticket = db.TicketTypes(event_id=index+1,
                                    ticket_type=ticket['ticket_type'],
                                    total_number=ticket['total_number'],
                                    price=ticket['price'],
                                    sold=sold_tickets)

            session.add(ticket)

    session.commit()


# Functions to populate bookings
def init_bookings(session):
    data = read_csv_to_dict(data_subdir/'bookings.csv')

    for index, item in enumerate(data):

        booking = db.Bookings(customer_id=item['customer_id'],
                              event_id=item['event_id'],
                              transaction_id=item['transaction_id'],
                              date_created=datetime.fromisoformat(item['date_created']))
        session.add(booking)

        for ticket in json.loads(item['booking_details']):
            ticket_type = session.query(db.TicketTypes).filter(and_(db.TicketTypes.ticket_type.like(ticket['ticket_type']),
                                                                    db.TicketTypes.event_id == item['event_id'])).first()
            ticket_type_id = ticket_type.id

            # Update number of ticket in TicketTypes table
            ticket_type.total_number = db.TicketTypes.total_number - ticket['quantity']
            ticket_type.sold = db.TicketTypes.sold + ticket['quantity']

            # Add the tickets into the BookingDetails table
            ticket = db.BookingDetails(booking_id=index+1,
                                       ticket_id=ticket_type_id,
                                       quantity=ticket['quantity'])
            session.add(ticket)

    session.commit()


# Function to populate reviews
def init_reviews(session):
    data = read_csv_to_dict(data_subdir/'reviews.csv')
    for item in data:
        review = db.Reviews(customer_id=item['customer_id'],
                              event_id=item['event_id'],
                              comment=item['comment'],
                              rating=item['rating'],
                              date_created=datetime.fromisoformat(item['date_created']))
        session.add(review)

    session.commit()
    
    
# Function to populate event notifications
def init_event_noti(session):
    data = read_csv_to_dict(data_subdir/'event_notifications.csv')
    for item in data:
        noti = db.EventNotifications(event_id=item['event_id'],
                                     user_id=item['user_id'],
                                     description=item['description'],
                                     date_created=datetime.fromisoformat(item['date_created']),
                                     is_read=bool(int(item['is_read'])))
        session.add(noti)

    session.commit()
    

# Function to populate user connections
def init_connections(session):
    data = read_csv_to_dict(data_subdir/'connections.csv')
    for item in data:
        connection = db.Connections(owner_id=item['owner_id'],
                                    member_id=item['member_id'])
        session.add(connection)

    session.commit()
