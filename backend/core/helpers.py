# -*- coding: utf-8 -*-
"""
Helper functions for all APIs

"""
# this is to suppress SVM and other warnings (otherwise makes the logs unreadable)
def warn(*args, **kwargs):
    pass
import warnings
warnings.warn = warn

from http import HTTPStatus
from flask import current_app, jsonify, make_response, render_template, request
from flask_restx import abort
from database import session
import database.db_models as db
from core import f_bcrypt, mail
from datetime import datetime, timedelta, date
from core.decorators import login_required
from sqlalchemy import desc, and_, text
from sqlalchemy.sql.expression import func
from botocore.exceptions import NoCredentialsError
from threading import Thread
from flask_mail import Message
from pathlib import Path
import os
import sys
import boto3
from werkzeug.exceptions import InternalServerError
from math import ceil
from dateutil.relativedelta import relativedelta
import pickle
import numpy as np
import pandas as pd 


# Function to check the provided email
def process_preRegister(email):
    user = session.query(db.Users).filter_by(email=email).first()
    session.commit()
    session.close()
    
    # Check if the provided email already exists in the database
    if not user:
        api_response = jsonify(status='OK',
                               message='User Does not exist in the database')
        return make_response(api_response, HTTPStatus.OK)
    else:
        api_response = jsonify(status='BAD REQUEST',
                               message='User already exists in the database')
        return make_response(api_response, HTTPStatus.BAD_REQUEST)


# Function for the registration proccess
def process_register(email, password, firstName, lastName, birthday, billingAdd, gpsCoordinates):
    user = session.query(db.Users).filter_by(email=email).first()

    # Check if email exists in the DB
    if user:
        abort(HTTPStatus.BAD_REQUEST,
              'Email already exists in the database.', status='Fail')
    
    # Check if birthday is more than current date
    birthday_datetime = datetime.strptime(birthday, "%Y-%m-%d")
    if birthday_datetime > datetime.now():
        abort(HTTPStatus.BAD_REQUEST,'Invalid birthday.', status='Fail')

    # Hash the password
    log_rounds = current_app.config.get('BCRYPT_LOG_ROUNDS')
    password_bytes = f_bcrypt.generate_password_hash(password, log_rounds)
    password_hash = password_bytes.decode('utf-8')

    # Store all the information in the database
    user = db.Users(email=email, password=password_hash,
                    first_name=firstName, last_name=lastName,
                    birthday=birthday, billing_add=billingAdd,
                    billing_gps_coord=gpsCoordinates)
    session.add(user)
    session.commit()
    session.close()
    api_response = jsonify(status='OK',
                           message='User Registered successfully.')

    return make_response(api_response, HTTPStatus.OK)


# Function for the log in proccess
def process_login(email, password):
    user = session.query(db.Users).filter_by(email=email).first()
    
    # Check if the provided email is valid
    if not user:
        abort(HTTPStatus.UNAUTHORIZED, 'Invalid email or password.', status='Fail')

    # Check if the provided password is valid
    if not f_bcrypt.check_password_hash(user.password, password):
        abort(HTTPStatus.UNAUTHORIZED, 'Invalid email or password.', status='Fail')

    # Get user ID and generate JWT token for the user
    user_id = user.id
    auth_token = user.encode_token()
    user.access_token = auth_token
    session.commit()
    session.close()

    # Get token expiry time in seconds
    expire_hours = current_app.config.get('TOKEN_EXPIRE_HOURS')
    expire_minutes = current_app.config.get('TOKEN_EXPIRE_MINUTES')
    token_expire_seconds = expire_hours*3600 + expire_minutes*60

    # Prepare a response for the frontend
    api_response = jsonify(status='OK',
                           message='User logged in successfully.',
                           data={'user_id': user_id},
                           token_type='bearer',
                           access_token=auth_token,
                           expires_in=token_expire_seconds)

    return make_response(api_response, HTTPStatus.OK)


# Function to upload photo to AWS S3
@login_required
def upload_to_aws(image_file,image_filename):
    bucket = 'eventloopbucket'
    S3_LOCATION = 'http://{}.s3.amazonaws.com/'.format(bucket)
    s3 = boto3.client('s3', aws_access_key_id='AKIAZS4I3TWUBHDBUJP6',
                      aws_secret_access_key='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')
    try:
        # Upload to S3
        s3.upload_fileobj(image_file, bucket,image_filename)
        print('Upload Successful')
        api_response =  '{}{}'.format(S3_LOCATION, image_filename)
        return make_response(api_response,HTTPStatus.OK)
    except FileNotFoundError:
        print('The file was not found')
        return make_response(HTTPStatus.BAD_REQUEST)
    except NoCredentialsError:
        print('Invalid S3 Credentials')
        return make_response(HTTPStatus.INTERNAL_SERVER_ERROR)


# Function to get details of an Event
def get_event_by_id(event_id):
    event = session.query(db.Events).filter_by(id=event_id).first()
    if not event:
        abort(HTTPStatus.NOT_FOUND,
              f'Event ID {event_id} NOT found in the database.', status='Fail')

    return event


# Function to add a new event
@login_required
def create_event(title, description, created_by, category, location_add, gps_coord, photo_url, start_datetime, end_datetime, tags, age_limit, status, tickets):
    # Fetch category id from EventCategories table and place it in Events table
    event_category = session.query(
        db.EventCategories).filter_by(name=category).first()
    event_category_id = event_category.id

    # Convert event datetime to datetime object and pass (both start and end)
    start_datetime_format = str(start_datetime)
    start_datetime = datetime.fromisoformat(start_datetime_format)
    
    # Check if start date is less than current date (i.e. start date is in the past)
    if start_datetime < datetime.now():
        abort(HTTPStatus.BAD_REQUEST, 'Invalid start date.', status='Fail')
    
    end_datetime_format = str(end_datetime)
    end_datetime = datetime.fromisoformat(end_datetime_format)
    
    # Check if end date is less than start date
    if end_datetime < start_datetime:
        abort(HTTPStatus.BAD_REQUEST, 'Invalid end date.', status='Fail')
        
    # Fetch status id from EventStatus table and place it in Events table
    event_status = session.query(db.EventStatus).filter_by(name=status).first()
    event_status_id = event_status.id

    # Add event data to the Events table
    event = db.Events(title=title, description=description,
                      created_by=created_by, category_id=event_category_id,
                      location_add=location_add, gps_coord=gps_coord,
                      photo_url=photo_url, start_datetime=start_datetime,
                      end_datetime=end_datetime, tags=tags,
                      age_limit=age_limit, status_id=event_status_id)
    session.add(event)

    # Get the id of the newly added event
    current_event = session.query(db.Events).order_by(db.Events.id.desc()).first()
    event_id = current_event.id

    # Example : [{'id': 1, 'ticket_type': 'VIP', 'total_number': 10, 'price': 10}]
    for each_ticket in tickets:
        tickets_actor = db.TicketTypes(
            event_id=event_id, ticket_type=each_ticket['ticket_type'], total_number=each_ticket['total_number'], price=each_ticket['price'])
        session.add(tickets_actor)

    session.commit()
    session.close()
    
    # Prepare a response for the frontend
    api_response = jsonify(status='CREATED',
                           data={'event_id': event_id},
                           message='Event Created Successfully.')
    return make_response(api_response, HTTPStatus.CREATED)


# Function retrieve 10 latest events
def fetch_upcoming_events():   
    # Check if event status is updated to Finished if the start_datetime has passed current time
    past_events = session.query(db.Events).filter(db.Events.status.has(and_(db.EventStatus.name!='Finished', db.EventStatus.name!='Cancelled'))).filter(db.Events.start_datetime < datetime.now()).all()
    
    if past_events:
        for event in past_events:
            # Change status to Finished (id = 3 in EventStatus table)
            event.status_id = 3
            
            # Add notification to EventNotifications table
            event_noti = db.EventNotifications(event_id=event.id, user_id=event.created_by,
                                               description=f'Event {event.title} status has been updated to Finished.',
                                               date_created=datetime.now(), is_read=False)
            session.add(event_noti)
            
        session.commit()
        session.close()
    
    # Get events that have status is not 'Finished' or 'Cancelled'
    unfinished_events = session.query(db.Events).filter(db.Events.status.has(and_(db.EventStatus.name!='Finished', db.EventStatus.name!='Cancelled')))
    
    # Order events by start date in descending order and retrieve the top 10
    latest_10_events = unfinished_events.filter(db.Events.start_datetime >= datetime.now()).order_by(db.Events.start_datetime.asc()).limit(10).all()
    if not latest_10_events:
        abort(HTTPStatus.NOT_FOUND, 'Event NOT found in the database.', status='Fail')
        
    return latest_10_events


# Function to send an email
def send_async_email(message):
    with current_app.app_context():
        try:
            mail.send(message)
        except ConnectionRefusedError:
            raise InternalServerError('[MAIL SERVER] not working')


# Function to set up content of the email and send it to the recipients
def send_email(subject, recipients, html_body):
    message = Message(subject, recipients=recipients)
    message.html = html_body

    send_async_email(message)
    # sub_thread = Thread(target=send_async_email, args=(message,))
    # sub_thread.start()


# Function to change password of the logged in user
@login_required
def process_change_password(email, current_password, new_password):
    # Get a user record from the database Users model based on the provided email
    user = session.query(db.Users).filter_by(email=email).first()

    # Check if the user is valid
    if not user:
        abort(HTTPStatus.UNAUTHORIZED, 'Invalid email or password.', status='Fail')

    # Check if the provided password is correct
    if not f_bcrypt.check_password_hash(user.password, current_password):
        abort(HTTPStatus.UNAUTHORIZED, 'Invalid email or password.', status='Fail')

    # Get the user's full name (for confirmation email)
    user_name = user.fullname

    # Hash the new password
    log_rounds = current_app.config.get('BCRYPT_LOG_ROUNDS')
    new_password_bytes = f_bcrypt.generate_password_hash(new_password, log_rounds)
    new_password_hash = new_password_bytes.decode('utf-8')

    # Update the new password in the database
    user.password = new_password_hash
    session.commit()
    session.close()

    # Send a confirmation email to customer using the html template
    html_file = 'password_change_confirmation.html'
    send_email('[EventLoop] Your password was updated',
                recipients=[email],
                html_body=render_template(html_file, name=user_name))

    # Prepare a response for the frontend
    api_response = jsonify(status='OK',
                           message='Password updated successfully.')

    return make_response(api_response, HTTPStatus.OK)


# Function to send reset password Email to the user
def process_forget_password(email, url):
    # Get a user record from the database Users model based on the provided email
    user = session.query(db.Users).filter_by(email=email).first()
    if not user:
        abort(HTTPStatus.UNAUTHORIZED, 'Invalid email.', status='Fail')

    # Get the user's full name from the database
    user_name = user.fullname

    # Create a JWT token using method defined Users model
    reset_token = user.encode_token()
    session.close()

    # Create an url including the JWT token
    reset_url = url + '/reset-password?token=' + reset_token

    # Send reset password email to the customer using the html template
    html_file = 'reset_password.html'
    send_email(subject='[EventLoop] Reset your password',
               recipients=[email],
               html_body=render_template(html_file, name=user_name, action_url=reset_url))

    # Prepare a response for the frontend
    api_response = jsonify(status='OK',
                           message='Password reset email sent.')
    return make_response(api_response, HTTPStatus.OK)


# Function to reset user password if the provided token is matched
def process_reset_password(new_password, reset_topken):
    # Decode the token using method defined in Users model
    result = db.Users.decode_token(reset_topken)

    # Check if token is valid
    if isinstance(result, str):
        abort(HTTPStatus.UNAUTHORIZED, result, status='Unauthorised')

    # Check if token belongs to the current_user
    # Get a user record from the database Users model based on the user_id decoded from the token
    current_user = session.query(db.Users).filter_by(id=result['user_id']).first()
    if current_user is None:
        abort(HTTPStatus.UNAUTHORIZED, 'Invalid authentication token.', status='Unauthorised')

    # Get the user's full name and email from the database
    user_name = current_user.fullname
    user_email = current_user.email

    # Hash the new password
    log_rounds = current_app.config.get('BCRYPT_LOG_ROUNDS')
    new_password_bytes = f_bcrypt.generate_password_hash(new_password, log_rounds)
    new_password_hash = new_password_bytes.decode('utf-8')

    # Update the new password in the database
    current_user.password = new_password_hash
    session.commit()
    session.close()

    # Send a confirmation email to customer using the html template
    html_file = 'password_change_confirmation.html'
    send_email('[EventLoop] Your password was reset',
                recipients=[user_email],
                html_body=render_template(html_file, name=user_name))

    # Prepare a response for the frontend
    api_response = jsonify(status='OK',
                           message='Password reset successfully.')

    return make_response(api_response, HTTPStatus.OK)


# Function to get details of a user
@login_required
def get_user_by_id(id):
    # Fetch all information from the User Table
    user = session.query(db.Users).filter_by(id=id).first()
    if not user:
        abort(HTTPStatus.NOT_FOUND,
              f'User ID {id} NOT found in the database.', status='Fail')
    return (user, HTTPStatus.OK)


# Function to update details of a user 
@login_required
def update_user_by_id(id,gender, billing_add, billing_gps_coord, home_add, home_gps_coord, phone, website_url, photo_url, about_me, interests, matching_option):
    user = session.query(db.Users).filter_by(id=id).first()
    
    # Check it the user ID is valid
    if not user:
        abort(HTTPStatus.NOT_FOUND,
              f'User ID {id} NOT found in the database.', status='Fail')

    # Update user details in the database
    if gender != None:
        user.gender = gender
    if billing_add != None:
        user.billing_add = billing_add
    if billing_gps_coord != None:
        user.billing_gps_coord = billing_gps_coord
    if home_add != None:
        user.home_add = home_add
    if home_gps_coord != None:
        user.home_gps_coord = home_gps_coord
    if phone != None:
        user.phone = phone
    if website_url != None:
        user.website_url = website_url
    if photo_url != None:
        user.photo_url = photo_url
    if about_me != None:
        user.about_me = about_me
    if interests != None:
        user.interests = interests
    if matching_option != None:
        user.matching_option = matching_option

    session.commit()
    user_re = session.query(db.Users).filter_by(id=id).first()
    session.close()
    return (user_re, HTTPStatus.OK)


# Function to update details of an event
@login_required
def patch_event_by_id(id,location_add,gps_coord,start_datetime,end_datetime,tags,status):
    event = session.query(db.Events).filter_by(id=id).first()
    
    # Check if the event ID is valid
    if not event:
        abort(HTTPStatus.NOT_FOUND,
              f'Event ID {id} NOT found in the database.', status='Fail')
        
    event_name = event.title
    organiser_id = event.created_by
    now = datetime.now()

    if location_add != None:
        event.location_add = location_add
        
    if gps_coord != None:
        event.gps_coord = gps_coord
        
    if start_datetime != None:
        # Convert event datetime to datetime object and pass to table
        start_datetime_format = str(start_datetime)
        start_datetime = datetime.fromisoformat(start_datetime_format)
        event.start_datetime = start_datetime
        
    if end_datetime != None:
        # Convert event datetime to datetime object and pass to table
        end_datetime_format = str(end_datetime)
        end_datetime = datetime.fromisoformat(end_datetime_format)
        event.end_datetime = end_datetime
        
    if tags != None:
        event.tags = tags
        
    if status != None:
        # Fetch status id from EventStatus table and place it in Events table
        event_status = session.query(db.EventStatus).filter_by(name=status).first()
        if not event_status:
            abort(HTTPStatus.NOT_FOUND,
                  f'Event Status: {status} :NOT found in the database.', status='Fail')
        
        # Check if the cancellation date is within 7 days before the start of the event
        if status == 'Cancelled' and now > event.start_datetime - timedelta(days=7):
            abort(HTTPStatus.BAD_REQUEST,
                  'Event cannot be cancelled less than 7 days prior to the event start date.', status='Fail')     
            
        event_status_id = event_status.id
        # Appending the status id in the events table
        event.status_id = event_status_id

    session.commit()

    # Sending an email to all customers registered for the event
    # Fetch all bookings for the current event
    bookings = session.query(db.Bookings).filter_by(event_id=id)
    list_customerID = []
    for each_booking in bookings:
        # Get customer information
        customer_email = each_booking.customer.email
        customer_name = each_booking.customer.fullname
        
        # Get organiser information
        organiser = session.query(db.Users).filter_by(id=organiser_id).first()
        organiser_email = organiser.email
        organiser_name = organiser.fullname
        
        # send the customer an email informing them of the change
        if status == 'Cancelled':
            html_file = 'toUser_event_cancellation.html'
            send_email('[EventLoop] Event Cancellation Notice',
                        recipients=[customer_email],
                        html_body=render_template(html_file, name=customer_name, event_name=event_name, booking_id = f'{each_booking.id:05}',
                                                  organiser_name=organiser_name, organiser_email=organiser_email))
        
            # Check if the customer has already been added to notification table for the event, if not, send a notification
            if each_booking.customer_id not in list_customerID:
                list_customerID.append(each_booking.customer_id)
                # Add notification to EventNotifications table
                event_noti = db.EventNotifications(event_id=id, user_id=each_booking.customer_id,
                                                description=f'Event {event_name} has been cancelled',
                                                date_created=datetime.now(), is_read=False)
                session.add(event_noti)
        
        else:
            html_file = 'toUser_event_update.html'
            send_email('[EventLoop] Updates on Your Registered Event',
                        recipients=[customer_email],
                        html_body=render_template(html_file, name=customer_name, event_name=event_name, booking_id = f'{each_booking.id:05}'))
            
            # Check if the customer has already been added to notification table for the event, if not, send a notification
            if each_booking.customer_id not in list_customerID:
                list_customerID.append(each_booking.customer_id)
                # Add notification to EventNotifications table
                event_noti = db.EventNotifications(event_id=id, user_id=each_booking.customer_id,
                                                description=f'Event {event_name} details has been updated',
                                                date_created=datetime.now(), is_read=False)
                session.add(event_noti)
       
    session.commit()
    session.close()
    
    # Prepare Response Payload
    if status == 'Cancelled':
        # If we need tro Delete the Event from the database, can be done here (probably todo)
        api_response = jsonify(status='OK',
                               message='Event Cancelled Succesefully')
    else:
        api_response = jsonify(status='OK',
                               message='Event Details Updated Succesefully')

    return make_response(api_response, HTTPStatus.OK)


# Function to apply pagination to a list of data
def get_paginated_list(full_data, url, page, size, order_str=None, filter_str=None):
    nb_of_items = len(full_data)
    nb_of_page = ceil(nb_of_items/int(size))

    # Check if page number is out of range
    if page > nb_of_page:
        abort(HTTPStatus.BAD_REQUEST, f'Page {page} is out of range (Maximum page number is {nb_of_page}).', status='Fail')

    start_index = (page - 1)*size
    end_index = (start_index + size) if page*size < nb_of_items else nb_of_items

    # Obtain the paginated list based on the indexes
    output_list = full_data[start_index : end_index]

    # Construct links
    if order_str is not None and filter_str is not None:
        self_link = {'href': f'{url}?page={page}&size={size}&order={order_str}&{filter_str}'}
        previous_link = {'href': f'{url}?page={page-1}&size={size}&order={order_str}&{filter_str}'}
        next_link = {'href': f'{url}?page={page+1}&size={size}&order={order_str}&{filter_str}'}
        first_link = {'href': f'{url}?page=1&size={size}&order={order_str}&{filter_str}'}
        last_link = {'href': f'{url}?page={nb_of_page}&size={size}&order={order_str}&{filter_str}'}

    elif order_str is not None:
        self_link = {'href': f'{url}?page={page}&size={size}&order={order_str}'}
        previous_link = {'href': f'{url}?page={page-1}&size={size}&order={order_str}'}
        next_link = {'href': f'{url}?page={page+1}&size={size}&order={order_str}'}
        first_link = {'href': f'{url}?page=1&size={size}&order={order_str}'}
        last_link = {'href': f'{url}?page={nb_of_page}&size={size}&order={order_str}'}

    elif filter_str is not None:
        self_link = {'href': f'{url}?page={page}&size={size}&{filter_str}'}
        previous_link = {'href': f'{url}?page={page-1}&size={size}&{filter_str}'}
        next_link = {'href': f'{url}?page={page+1}&size={size}&{filter_str}'}
        first_link = {'href': f'{url}?page=1&size={size}&{filter_str}'}
        last_link = {'href': f'{url}?page={nb_of_page}&size={size}&{filter_str}'}

    else:
        self_link = {'href': f'{url}?page={page}&size={size}'}
        previous_link = {'href': f'{url}?page={page-1}&size={size}'}
        next_link = {'href': f'{url}?page={page+1}&size={size}'}
        first_link = {'href': f'{url}?page=1&size={size}'}
        last_link = {'href': f'{url}?page={nb_of_page}&size={size}'}


    # Check if the query page is the only page
    if page == 1 and page == nb_of_page:
        has_prev = False
        has_next = False
        output_links = {'self': self_link,
                        'prev': None,
                        'next': None,
                        'first': None,
                        'last': None
                        }

    # Check if the query page is the first page
    elif page == 1 and page < nb_of_page:
        has_prev = False
        has_next = True
        output_links = {'self': self_link,
                        'prev': None,
                        'next': next_link,
                        'first': None,
                        'last': last_link
                        }

    # Check if the query page is the last page
    elif page > 1 and page == nb_of_page:
        has_prev = True
        has_next = False
        output_links = {'self': self_link,
                        'prev': previous_link,
                        'next': None,
                        'first': first_link,
                        'last': None
                        }

    else:
        has_prev = True
        has_next = True
        output_links = {'self': self_link,
                        'prev': previous_link,
                        'next': next_link,
                        'first': first_link,
                        'last': last_link
                        }

    paginated_response = {'page': page,
                          'total_pages': nb_of_page,
                          'items_per_page': size,
                          'total_items': nb_of_items,
                          'items': output_list,
                          'has_prev': has_prev,
                          'has_next': has_next,
                          'links': output_links
                          }

    return paginated_response


# Funcation to search and filter events
def search_events(page, size, order, title, category, location, status, start_date):
    # Check query parameters
    if page < 1:
        abort(HTTPStatus.BAD_REQUEST, f'Page number {page} is invalid.', status='Fail')

    elif size < 1:
        abort(HTTPStatus.BAD_REQUEST, f'Size {size} is invalid.', status='Fail')



    # Prepare a list of filter conditions
    all_filters = []
    input_filters = []
    if title is not None:
        all_filters.append(db.Events.title.contains(title))
        input_filters.append(f'title={title}')

    if category is not None:
        all_filters.append(db.Events.category.has(db.EventCategories.name == category))
        input_filters.append(f'category={category}')

    if location is not None:
        all_filters.append(db.Events.location_add.contains(location))
        input_filters.append(f'location={location}')

    if status is not None:
        all_filters.append(db.Events.status.has(db.EventStatus.name == status))
        input_filters.append(f'status={status}')

    if start_date is not None:
        start_datetime = datetime.fromisoformat(str(start_date))
        next_datetime = start_datetime + timedelta(days=1)
        all_filters.append(and_(db.Events.start_datetime >= start_datetime,
                                db.Events.start_datetime < next_datetime))
        input_filters.append(f'start_date={start_date}')

    # If there is no search or filtering, retrieve a list of all events
    if not all_filters:
        filtered_events = session.query(db.Events)
        filter_str = None

    # Retrieve a list of filtered events
    else:
        filtered_events = session.query(db.Events).filter(and_(*all_filters))
        filter_str = '&'.join(input_filters)

    # Prepare a list of ordering (sorting) conditions
    order_options = ['title', 'start_datetime']
    all_orders = []
    for item in order:
        if item[0] not in ['+', '-'] or item[1:] not in order_options:
            abort(HTTPStatus.BAD_REQUEST, f'Order criteria {item} is invalid.', status='Fail')

        if item.startswith('+'):
            # modified_item = f'db.Events.{item[1:]}.asc()'
            # modified_item = f'{item[1:]} ASC'
            # all_orders.append(text(modified_item))
            sort_attribute = getattr(db.Events, item[1:]).asc()
            all_orders.append(sort_attribute)

        if item.startswith('-'):
            # modified_item = f'db.Events.{item[1:]}.desc()'
            # modified_item = f'{item[1:]} DESC'
            # all_orders.append(text(modified_item))
            sort_attribute = getattr(db.Events, item[1:]).desc()
            all_orders.append(sort_attribute)

    # Sort the list of filtered events
    list_events = filtered_events.order_by(*all_orders).all()

    if not list_events:
        abort(HTTPStatus.NOT_FOUND,f'Events NOT found in the database based on the required criteria.', status='Fail')

    # Extract the base url from the request (ie. http://localhost:5000/events)
    url = request.base_url
    # Construct a string for ordering (sorting) conditions
    order_str = ','.join(order)

    return get_paginated_list(list_events, url, page, size, order_str, filter_str)


# Function to add a a new booking
@login_required
def create_booking(customer_id, event_id, transaction_id, tickets):
    event = session.query(db.Events).filter_by(id=event_id).first()

    # Check if the event exists in the db
    if not event:
        abort(HTTPStatus.NOT_FOUND,f'Event ID {event_id} NOT found in the database.', status='Fail')

    # Get event title
    event_title = event.title

    # Get the organiser's full name and email from the database
    # organiser = session.query(db.Users).filter_by(id=event.created_by).first()
    organiser_name = event.owner.fullname
    organiser_email = event.owner.email

    # Get the user's full name and email from the database
    current_user = session.query(db.Users).filter_by(id=customer_id).first()
    user_name = current_user.fullname
    user_email = current_user.email
    user_billing = current_user.billing_add

    # Get current time
    now = datetime.now()

    # Add booking data to the Bookings table
    booking = db.Bookings(customer_id=customer_id, event_id=event_id,
                          transaction_id=transaction_id, date_created=now)
    session.add(booking)

    # Get the id of the newly added booking
    current_booking = session.query(db.Bookings).order_by(db.Bookings.id.desc()).first()
    booking_id = current_booking.id

    booking_dict = dict()
    for item in tickets:
        # Get ticket id from TicketTypes table and place it in BookingDetails table
        ticket_type = session.query(db.TicketTypes).filter(and_(db.TicketTypes.ticket_type.like(item['ticket_type']),
                                                                db.TicketTypes.event_id == event_id)).first()

        # Check if ticket type is valid
        if not ticket_type:
            input_ticket_type = item['ticket_type']
            abort(HTTPStatus.NOT_FOUND,f'Ticket type {input_ticket_type} NOT found in the database.', status='Fail')

        ticket_type_id = ticket_type.id

        if ticket_type.total_number < item['quantity'] or item['quantity'] < 1:
            abort(HTTPStatus.BAD_REQUEST,'Invalid number of ticket.', status='Fail')

        else:
            # Update number of ticket in TicketTypes table
            ticket_type.total_number = db.TicketTypes.total_number - item['quantity']
            ticket_type.sold = db.TicketTypes.sold + item['quantity']

        # Add booking detail data to BookingDetails table
        ticket = db.BookingDetails(booking_id=booking_id,
                                   ticket_id=ticket_type_id,
                                   quantity=item['quantity'])
        session.add(ticket)

        # Add ticket and price information to the booking dictionary (to be used in html template)
        ticket_info = [int(item['quantity']), ticket_type.price * int(item['quantity'])]
        booking_dict[item['ticket_type']] = ticket_info

    session.commit()
    
    # Retrieve user interests and matching_options
    user_interests = current_user.interests
    user_matching_option = current_user.matching_option
    
    # Check if the user provided any interest and the matching_option is True
    if user_interests != None and user_matching_option == True:
        matched_users = []
        for interest in user_interests.split(','):
            interest = interest.strip()
            # Retrieve other users who have similar interests and attend the same event
            customer_bookings = session.query(db.Bookings).filter(and_(db.Bookings.event_id == event_id, db.Bookings.customer_id != customer_id)
                                                                  ).filter(db.Bookings.customer.has(db.Users.interests.ilike(f'%{interest}%'))).all()
            
            if not customer_bookings:
                continue
            else:
                for customer in customer_bookings:
                    matched_users.append(customer.customer_id)
        
        distinct_matched_users = list(set(matched_users))
        # Add notification to MatchNotifications table for each matched user                    
        for match_id in distinct_matched_users:
            match_noti = db.MatchNotifications(user_id=customer_id, matched_user_id=match_id,
                                               event_id=event_id, date_created=datetime.now(), is_read=False)
            session.add(match_noti)
    
        session.commit()
        
    session.close()

    # Send a confirmation email to customer using the html template
    html_file = 'booking_confirmation.html'
    send_email('[EventLoop] Booking confirmation',
               recipients=[user_email],
               html_body=render_template(html_file, name=user_name, event=event_title,
                                         organiser_name=organiser_name, organiser_email= organiser_email,
                                         booking_id=f'{booking_id:05}', date_created=now.strftime('%Y-%m-%d %H:%M:%S'),
                                         transaction_id=transaction_id, booking=booking_dict,
                                         billing_add=user_billing))

    # Prepare a response to the frontend
    api_response = jsonify(status='CREATED',
                       data={'booking_id': booking_id},
                       message='Booking Created Successfully.')

    return make_response(api_response, HTTPStatus.CREATED)


# Function to retrieve details of a booking
@login_required
def get_booking_by_id(booking_id):
    booking = session.query(db.Bookings).filter_by(id=booking_id).first()
    if not booking:
        abort(HTTPStatus.NOT_FOUND,f'Booking ID {booking_id} NOT found in the database.', status='Fail')

    return booking


# Function to delete a booking when user cancels his/her booking
@login_required
def delete_booking_by_id(booking_id):
    booking = session.query(db.Bookings).filter_by(id=booking_id).first()
    if not booking:
        abort(HTTPStatus.NOT_FOUND,f'Booking ID {booking_id} NOT found in the database.', status='Fail')

    event_start_datetime = booking.event.start_datetime
    now = datetime.now()

    # Check if the current date is within 7 days before the start of the event
    if now > event_start_datetime - timedelta(days=7):
        abort(HTTPStatus.BAD_REQUEST,'Booking cannot be cancelled less than 7 days prior to the event start date.', status='Fail')

    # Get event information
    event = session.query(db.Events).filter_by(id=booking.event_id).first()
    event_title = event.title
    organiser_name = event.owner.fullname
    organiser_email = event.owner.email

    # Get customer information
    current_user = session.query(db.Users).filter_by(id=booking.customer_id).first()
    user_name = current_user.fullname
    user_email = current_user.email
    user_billing = current_user.billing_add

    # Get a list of booking details
    tickets = booking.booking_details
    refund = 0
    for item in tickets:
        # Update number of ticket in TicketTypes table
        ticket_type = session.query(db.TicketTypes).filter_by(id=item.ticket_id).first()
        ticket_type.total_number = db.TicketTypes.total_number + item.quantity

        # Calculate the refund amount
        price_per_ticket = ticket_type.price
        quantity = item.quantity
        total = quantity*price_per_ticket
        refund += total

    # Send a confirmation email to customer using the html template
    html_file = 'booking_cancel_confirmation.html'
    send_email(f'[EventLoop] Booking# {booking_id:05} cancellation confirmed',
               recipients=[user_email],
               html_body=render_template(html_file, name=user_name, event=event_title,
                                         organiser_name=organiser_name, organiser_email= organiser_email))

    # Send an email notification to organiser using the html template
    html_file = 'booking_cancel_notification.html'
    send_email('[EventLoop] Customer cancelled a booking',
               recipients=[organiser_email],
               html_body=render_template(html_file, name=organiser_name, event=event_title,
                                         customer_name=user_name, customer_email= user_email,
                                         billing_add=user_billing, booking_id=f'{booking_id:05}',
                                         date_created=booking.date_created.strftime('%Y-%m-%d %H:%M:%S'),
                                         transaction_id=booking.transaction_id, refund_amount=refund))

    # Add notification to EventNotifications table
    event_noti = db.EventNotifications(event_id=event.id, user_id=event.created_by,
                                       description=f'Customer {user_name} has cancelled a booking of your event.',
                                       date_created=now, is_read=False)
    session.add(event_noti)

    # Delete the booking record from the database
    session.delete(booking)
    session.commit()
    session.close()

    # Prepare a response to the frontend
    api_response = jsonify(status='OK',
                           message=f'Booking with id {booking_id} is removed from the database.')

    return make_response(api_response, HTTPStatus.OK)


# Fetch the events that are created by the user having the input user id
@login_required
def user_created_events(input_user_id, page, size, status):
    # Query all information about the user
    user = session.query(db.Users).filter_by(id=input_user_id).first()

    # Check if user has created any event
    if not user.events:
        abort(HTTPStatus.NOT_FOUND, f'User ID {input_user_id} has NOT created any events.', status='Fail')

    # Check if event status is updated to Finished if the start_datetime has passed current time
    # for event in user.events:
    #     if event.start_datetime < datetime.now() and event.status.name not in ['Finished', 'Cancelled']:
    #         # Change status to Finished (id = 3 in EventStatus table)
    #         event.status_id = 3
            
    #         # Add notification to EventNotifications table
    #         event_noti = db.EventNotifications(event_id=event.id, user_id=event.created_by,
    #                                            description=f'Event {event.title} status has been updated to Finished.',
    #                                            date_created=datetime.now(), is_read=False)
    #         session.add(event_noti)
        
    # session.commit()
    # session.close()

    user_created_events = []
    # Loop through list of events and filter events that match the required status
    for event in user.events:
        if event.status.name in status:
            user_created_events.append(event)
        else:
            continue

    if not user_created_events:
        abort(HTTPStatus.NOT_FOUND, 'Events NOT found in the database based on the required criteria.', status='Fail')

    user_created_events = sorted(user_created_events, key=lambda x: x.start_datetime, reverse=False)

    # Extract the base url from the request (ie. http://localhost:5000/users/created_events)
    url = request.base_url

    status_conditions = ','.join(status)
    filter_str = f'status={status_conditions}'

    return get_paginated_list(user_created_events, url, page, size, order_str=None, filter_str=filter_str)


# Function to retrieve a list of bookings purchased by the user
@login_required
def user_purchased_events(input_user_id, page, size, status):
    user = session.query(db.Users).filter_by(id=input_user_id).first()

    # Check if user_id is valid
    if not user:
        abort(HTTPStatus.NOT_FOUND,f'User ID {input_user_id} NOT found in the database.', status='Fail')

    # Check if user has purchased any ticket
    if not user.bookings:
        abort(HTTPStatus.NOT_FOUND, f'User ID {input_user_id} has NOT purchased any tickets.', status='Fail')

    user_purchased_events = []

    # Loop through list of bookings and filter events that match the required status
    for booking in user.bookings:
        if booking.event.status.name in status:
            user_purchased_events.append(booking)
        else:
            continue

    if not user_purchased_events:
        abort(HTTPStatus.NOT_FOUND,f'Events NOT found in the database based on the required criteria.', status='Fail')

    sorted_purchased_events = sorted(user_purchased_events, key=lambda x: x.date_created, reverse=True)
    sorted_purchased_events = sorted(sorted_purchased_events, key=lambda x: x.event.start_datetime, reverse=False)

    # Extract the base url from the request (ie. http://localhost:5000/users/purchased_events)
    url = request.base_url

    status_conditions = ','.join(status)
    filter_str = f'status={status_conditions}'

    return get_paginated_list(sorted_purchased_events, url, page, size, order_str=None, filter_str=filter_str)


# Function to add a new review
@login_required
def create_review(customer_id, event_id, rating, comment):
    # Check if the event is finished
    event = session.query(db.Events).filter_by(id=event_id).first()
    if event.status.name != 'Finished':
        abort(HTTPStatus.BAD_REQUEST, 'Event is NOT finished.', status='Fail')
    
    # Check if user had a booking of the event
    booking = session.query(db.Bookings).filter_by(customer_id=customer_id, event_id=event_id).first()
    if not booking:
        abort(HTTPStatus.BAD_REQUEST, 'User did NOT attend the event.', status='Fail')
        
    # Check if the user has already given the review for this event
    review = session.query(db.Reviews).filter_by(customer_id=customer_id, event_id=event_id).first()
    if review:
        abort(HTTPStatus.CONFLICT,
              'A review given by this user for the event already exists in the database.', status='Fail')
       
    date_created = datetime.now()

    # Add the review to review table
    new_review = db.Reviews(customer_id=customer_id, event_id=event_id, comment=comment, rating=rating, date_created = date_created)
    session.add(new_review)

    # Get the ID of newly added review
    current_review = session.query(db.Reviews).order_by(db.Reviews.id.desc()).first()
    review_id = current_review.id

    session.commit()
    session.close()

    # Make Response and return a 200 OK
    api_response = jsonify(status='CREATED',
                           data={'review_id': review_id},
                           message='Review Created Succesefully.')
    return make_response(api_response, HTTPStatus.CREATED)


# Fetch all reviews for an event with event_id
def get_reviews(event_id,page,size):
     # Check if the event id is valid
    event = session.query(db.Events).filter_by(id=event_id).first()
    if not event:
        abort(HTTPStatus.NOT_FOUND,'Invalid Event ID', status='Fail')

    # Else, fetch all details of the reviews in descending order of IDs (the latest reviews are stored in the bottom)
    output_reviews = session.query(db.Reviews).filter_by(event_id=event_id).order_by(
        db.Reviews.id.desc()).all()
    # If no reviews are available for the event, send an appropriate message
    if not output_reviews:
        abort(HTTPStatus.NOT_FOUND, f'No review available for the event ID {event_id}.', status='Fail')

    # Extract the base URL
    url = request.base_url

    # Paginate the output and return
    return get_paginated_list(output_reviews, url, page, size, order_str=None, filter_str=None)


# Function to retrieve a list of reviews made by the user
@login_required
def user_reviews(input_user_id, page, size):
    user = session.query(db.Users).filter_by(id=input_user_id).first()

    # Check if user_id is valid
    if not user:
        abort(HTTPStatus.NOT_FOUND,f'User ID {input_user_id} NOT found in the database.', status='Fail')

    # Check if user has purchased any ticket
    if not user.reviews:
        abort(HTTPStatus.NOT_FOUND, f'User ID {input_user_id} has NOT made any reviews.', status='Fail')

    user_reviews = session.query(db.Reviews).filter_by(customer_id=input_user_id).all()

    user_reviews = sorted(user_reviews, key=lambda x: x.date_created, reverse=True)

    # Extract the base url from the request (ie. http://localhost:5000/users/purchased_events)
    url = request.base_url

    return get_paginated_list(user_reviews, url, page, size, order_str=None, filter_str=None)


# Function to retrieve a list of cutomers of an event
@login_required
def get_all_customers(event_id, page, size):
    event = session.query(db.Events).filter_by(id=event_id).first()

    # Check if event_id is valid
    if not event:
        abort(HTTPStatus.NOT_FOUND,f'Event ID {event_id} NOT found in the database.', status='Fail')

    # Check if event has any booking
    if not event.bookings:
        abort(HTTPStatus.NOT_FOUND, f'Event ID {event_id} has NO customer.', status='Fail')

    customer_bookings = session.query(db.Bookings).filter_by(event_id=event_id).all()

    customer_bookings = sorted(customer_bookings, key=lambda x: (x.customer.fullname, x.date_created), reverse=False)

    # Extract the base url from the request (ie. http://localhost:5000/users/purchased_events)
    url = request.base_url

    return get_paginated_list(customer_bookings, url, page, size, order_str=None, filter_str=None)


# Function to retrieve all notifications of an user
@login_required
def get_user_notifications(user_id):
    user = session.query(db.Users).filter_by(id=user_id).first()

    # Check if user_id is valid
    if not user:
        abort(HTTPStatus.NOT_FOUND, f'User ID {user_id} NOT found in the database.', status='Fail')

    seven_days_ago = datetime.now() - timedelta(days = 7)
    
    # Get all notifications for the last 7 days
    event_notifications = session.query(db.EventNotifications
                                        ).filter(db.EventNotifications.user_id == user_id
                                                 ).filter(db.EventNotifications.date_created >= seven_days_ago
                                                          ).order_by(db.EventNotifications.id.desc()).all()
    
    connection_notifications = session.query(db.MatchNotifications
                                        ).filter(db.MatchNotifications.user_id==user_id
                                                 ).filter(db.MatchNotifications.date_created >= seven_days_ago
                                                          ).order_by(db.MatchNotifications.id.desc()).all()

    return event_notifications, connection_notifications


# Function to update the notification is_read tag
@login_required
def update_notification_by_id(notification_id, input_type, input_tag):
    if input_type == 'events':
        notification = session.query(db.EventNotifications).filter_by(id=notification_id).first()

    else:
        notification = session.query(db.MatchNotifications).filter_by(id=notification_id).first()
        
    if not notification:
        abort(HTTPStatus.NOT_FOUND, f'Notification ID {notification_id} NOT found in the database.', status='Fail')
    
    notification.is_read = input_tag
    session.commit()
    session.close()
    
    # Prepare a response for the frontend
    api_response = jsonify(status='OK',
                           message='Notifications status updated successfully.')

    return make_response(api_response, HTTPStatus.OK)


# Function to get the last number of months since the input date
def get_last_months(start_date, months):
    results = []
    for i in range(months):
        start_date += relativedelta(months = -1)
        results.append(date(start_date.year,start_date.month,1))

    return results


# Function to calculate the age of user based on birthday
def calculate_age(birthdate):
    today = date.today()
    
    # A boolean that represents if today's day/month precedes the birth day/month
    one_or_zero = ((today.month, today.day) < (birthdate.month, birthdate.day))
    
    # Calculate the difference in years from the date object's components
    year_difference = today.year - birthdate.year

    # Subtract the 'one_or_zero' boolean 
    # from 'year_difference'. (This converts
    # True to 1 and False to 0 under the hood.)
    age = year_difference - one_or_zero
    
    return age


# Function to retrieve the statistics summary
@login_required
def get_statistics(input_user_id):
    # Query all information about the user
    user = session.query(db.Users).filter_by(id=input_user_id).first()

    # Check if user has created any event
    if not user.events:
        abort(HTTPStatus.NOT_FOUND, f'User ID {input_user_id} has NOT created any events.', status='Fail')
        
    a_year_ago = datetime.now() - timedelta(days = 365)
    
    event_sales = []
    bookings_list = []
    customers_list = []
    # Loop through list of events
    for event in user.events:
        # Get sales data for each event that is not cancelled
        if event.start_datetime > a_year_ago and event.status.name != 'Cancelled':
            event_sales.append(event)
        
        # Loop through list of bookings for each event
        for booking in event.bookings:
            # Get customer data add add to the list of customers
            customer_name = booking.customer.fullname
            customer_age = calculate_age(booking.customer.birthday)
            customer_info = {'name': customer_name, 'age': customer_age}
            if customer_info not in customers_list:
                customers_list.append(customer_info)
            
            # Get booking data and add to the list of bookings
            booking_amount = 0
            for item in booking.booking_details:
                # Calculate the total amount
                price_per_ticket = item.ticket_type.price
                quantity = item.quantity
                total = quantity*price_per_ticket
                booking_amount += total
            
            booking_info = {'booking_id': booking.transaction_id,
                            'date_created': booking.date_created,
                            'amount': booking_amount}
            
            if booking_info not in bookings_list:
                bookings_list.append(booking_info) 

    if not event_sales:
        abort(HTTPStatus.NOT_FOUND, 'Events NOT found in the database based on the required criteria.', status='Fail')

    event_sales = sorted(event_sales, key=lambda x: x.start_datetime, reverse=False)
    
    # Create a list of 12 months before today date
    last_12_months = sorted([i.strftime('%Y-%m') for i in get_last_months(datetime.today(), 12)], reverse=False)
    
    # Initialise a dictionary of monthly income
    monthly_income = {k: 0 for k in last_12_months}
    for booking in bookings_list:
        booking_month = booking['date_created'].strftime('%Y-%m')
        if booking_month in monthly_income.keys():
            monthly_income[booking_month] += booking['amount']

    # Initialise a dictionary of customer age groups
    age_groups = {'Under 19': 0, '19-30': 0, '31-40': 0, '41-50': 0, 'Above 50': 0}
    for customer in customers_list:
        if customer['age'] <= 18:
            age_groups['Under 19'] += 1
        
        elif customer['age'] > 18 and customer['age'] <= 30:
            age_groups['19-30'] += 1
            
        elif customer['age'] > 30 and customer['age'] <= 40:
            age_groups['31-40'] += 1
            
        elif customer['age'] > 40 and customer['age'] <= 50:
            age_groups['41-50'] += 1
            
        elif customer['age'] > 50:
            age_groups['Above 50'] += 1

    # Update the number of customers for each age group to percentage
    age_groups.update((x, y/len(customers_list) * 100) for x, y in age_groups.items())      

    return event_sales, monthly_income, age_groups

# @login_required
def get_recommendation(input_user_id):
    obtained_events_list = []
    data = pd.read_csv('core/ML/data_re.csv')
    interest = dict(zip(data['Interest'].tolist(), range(len(data['Interest'].tolist()))))

    # fetch all the interest from the user
    user = session.query(db.Users).filter_by(id=input_user_id).first()
    user_interests = user.interests

    # Get events that have status is not 'Finished' or 'Cancelled' or 'Sold Out'
    unfinished_events = session.query(db.Events).filter(db.Events.status.has(and_(db.EventStatus.name!='Finished', db.EventStatus.name!='Cancelled',  db.EventStatus.name!='Sold Out')))
    
    # if the user has no interests, then suggest 4 random events
    if user_interests == None:
        # Order events by start date in descending order and retrieve random 4
        random_4_events = unfinished_events.filter(db.Events.start_datetime >= datetime.now()).order_by(db.Events.start_datetime.asc(),func.random()).limit(4).all()
        # if there are no events that exist after the current datetime and are Not Finished / Cancelleds, then give a NOT FOUND
        if not random_4_events:
            abort(HTTPStatus.NOT_FOUND, 'Events NOT found in the database.', status='Fail')
        return(random_4_events)
    # Else, for each interest, obtain a category from ML model
    else:
        user_interests = user_interests.split(',')                      # convert to list
        svm_model = pickle.load(open('core/ML/SVM_model.sav', 'rb'))    # load the SVM model that has been pretrained.
        for each_interest in user_interests:
            each_interest = each_interest.strip()
            num_interest = np.array(interest.get(each_interest)).reshape(-1,1)
            obtained_category_id = int(svm_model.predict(num_interest)[0])
            # Fetch two random unfinished events on each category        
            random_2_events = unfinished_events.filter(db.Events.start_datetime >= datetime.now(), db.Events.category_id == obtained_category_id).order_by(db.Events.start_datetime.asc(),func.random()).limit(2).all()
            # Add the random events of each category to the list only if it is not already part of the recommendations
            for each_event in random_2_events:
                if each_event not in obtained_events_list:
                    obtained_events_list.append(each_event)
        # if that doesn't make up for min of 4 events, fill the rest with random events
        if len(obtained_events_list) < 4:
            count_left = 4 - len(obtained_events_list)
            random_events = unfinished_events.filter(db.Events.start_datetime >= datetime.now()).order_by(db.Events.start_datetime.asc(),func.random()).limit(count_left).all()
            for each_event in random_events:
                if each_event not in obtained_events_list:
                    obtained_events_list.append(each_event)
        # return a maximum of 8 events
        return(obtained_events_list[0:8])

# Function to get details of a user for connection profile
@login_required
def get_connection_profile(member_id, owner_id):
    # Fetch all information from the User Table
    user = session.query(db.Users).filter_by(id=member_id).first()
    if not user:
        abort(HTTPStatus.NOT_FOUND, f'User ID {member_id} NOT found in the database.', status='Fail')
    
    # Check if the owner id is valid
    owner = session.query(db.Users).filter_by(id=owner_id).first()
    if not owner:
        abort(HTTPStatus.NOT_FOUND, f'User ID {owner_id} NOT found in the database.', status='Fail')
    
    # Convert query object to a dictionary
    user_dict = {c.name: str(getattr(user, c.name)) for c in user.__table__.columns}
    
    # Check if the viewing profile is already in the connection list of the current user
    connection = session.query(db.Connections).filter(and_(db.Connections.owner_id==owner_id, db.Connections.member_id==member_id)).first()
    if connection:
        user_dict.update({'is_connected': True})     
    else: 
        user_dict.update({'is_connected': False})
        
    return user_dict


# Function to add a new connection
@login_required
def create_connection(owner_id, member_id):
    # Check if the user id is valid
    owner = session.query(db.Users).filter_by(id=owner_id).first()
    if not owner:
        abort(HTTPStatus.BAD_REQUEST, f'User ID {owner_id} NOT found in the database.', status='Fail')
        
    member = session.query(db.Users).filter_by(id=member_id).first()
    if not member:
        abort(HTTPStatus.BAD_REQUEST, f'User ID {member_id} NOT found in the database.', status='Fail')
        
    # Check if the users are already connected
    connection = session.query(db.Connections).filter(and_(db.Connections.owner_id==owner_id, db.Connections.member_id==member_id)).first()
    if connection:
        abort(HTTPStatus.CONFLICT, f'User ID {owner_id} and {member_id} are already connected.', status='Fail')
        
    # Add the connection to Connections table
    new_connection = db.Connections(owner_id=owner_id, member_id=member_id)
    session.add(new_connection)

    # Get the ID of newly added connection
    current_connection = session.query(db.Connections).order_by(db.Connections.id.desc()).first()
    connection_id = current_connection.id

    session.commit()
    session.close()

    # Make an API response
    api_response = jsonify(status='CREATED',
                           data={'connection_id': connection_id},
                           message='Connection Created Succesefully.')
    return make_response(api_response, HTTPStatus.CREATED)


# Function to retrieve all connections of an user
@login_required
def get_connections(user_id, page, size):
     # Check if the user id is valid
    user = session.query(db.Users).filter_by(id=user_id).first()
    if not user:
        abort(HTTPStatus.NOT_FOUND, f'User ID {user_id} NOT found in the database.', status='Fail')

    # Retrieve all connections in descending order of IDs (the latest reviews are stored in the bottom)
    output_connections = session.query(db.Connections).filter_by(owner_id=user_id).all()
    # If no reviews are available for the event, send an appropriate message
    if not output_connections:
        abort(HTTPStatus.NOT_FOUND, f'No connection available for the user ID {user_id}.', status='Fail')

    output_connections = sorted(output_connections, key=lambda x: x.member.fullname, reverse=False)

    # Extract the base url from the request (ie. http://localhost:5000/connections/{user_id})
    url = request.base_url

    # Paginate the output and return
    return get_paginated_list(output_connections, url, page, size, order_str=None, filter_str=None)


# Function to remove a connection
@login_required
def delete_connection_by_id(connection_id):
    connection = session.query(db.Connections).filter_by(id=connection_id).first()
    if not connection:
        abort(HTTPStatus.NOT_FOUND, f'Connection ID {connection_id} NOT found in the database.', status='Fail')
        
    # Delete the connection record from the database
    session.delete(connection)
    session.commit()
    session.close()

    # Prepare a response to the frontend
    api_response = jsonify(status='OK',
                           message=f'Connection with id {connection_id} is removed from the database.')

    return make_response(api_response, HTTPStatus.OK)