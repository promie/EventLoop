0
from sqlalchemy import Column, Integer, Float, String, ForeignKey, UniqueConstraint, Table, Date, DateTime, Time, Boolean
from sqlalchemy import select, func
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime, timezone, timedelta
from flask import current_app
import jwt
import sys

Base = declarative_base()


class Users(Base):
    __tablename__ = 'Users'
    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String)
    birthday = Column(Date)
    gender = Column(String)
    billing_add = Column(String, nullable=False)
    billing_gps_coord = Column(String, nullable=False)
    home_add = Column(String)
    home_gps_coord = Column(String)
    phone = Column(String)
    website_url = Column(String)
    photo_url = Column(String)
    about_me = Column(String)
    interests = Column(String)
    matching_option = Column(Boolean)
    access_token = Column(String)
      
    def __repr__(self):
        return f'<User(id={self.id}, name={self.first_name}, email={self.email})>'

    @hybrid_property
    def fullname(self):
        return f'{self.first_name} {self.last_name}'

    # Token set up is based on Real Python tutorial:
    # https://realpython.com/token-based-authentication-with-flask/#jwt-setup
    def encode_token(self):
        now = datetime.utcnow()
        expire_hours = current_app.config.get('TOKEN_EXPIRE_HOURS')
        expire_minutes = current_app.config.get('TOKEN_EXPIRE_MINUTES')
        expire_time = now + timedelta(hours=expire_hours, minutes=expire_minutes)
        payload = {'exp': expire_time, #Expiration Time
                   'iat': now, #Issue At 
                   'sub': self.id} #UserID
        key = current_app.config.get('SECRET_KEY')
        return jwt.encode(payload, key, algorithm='HS256')

    @staticmethod
    def decode_token(access_token):
        if isinstance(access_token, bytes):
            access_token = access_token.decode('ascii')
            
        if access_token.startswith('Bearer '):
            split = access_token.split('Bearer')
            access_token = split[1].strip()
        
        try:
            key = current_app.config.get('SECRET_KEY')
            payload = jwt.decode(access_token, key, algorithms=['HS256'])
            user_dict = {'user_id': payload['sub'],
                         'token': access_token,
                         'expires_at': payload['exp']}
            return user_dict
            
        except jwt.ExpiredSignatureError:
            error = 'Access token expired. Please log in again.'
            return error
        
        except jwt.InvalidTokenError:
            error = 'Invalid token. Please log in again.'
            return error
        
    # Relationships:
    # One-to-Many relationship between Users (One) and Events (Many)
    events = relationship('Events', back_populates='owner')
    
    # One-to-Many relationship between Users (One) and Bookings (Many)
    bookings = relationship('Bookings', back_populates='customer')
    
    # One-to-Many relationship between Users (One) and Reviews (Many)
    reviews = relationship('Reviews', back_populates='customer')
    
    # One-to-Many relationship between Users (One) and MatchNotifications (Many)
    matches = relationship('MatchNotifications', back_populates='matched_user', foreign_keys='MatchNotifications.matched_user_id')
    
    # One-to-Many relationship between Users (One) and Connection (Many)
    connections = relationship('Connections', back_populates='member', foreign_keys='Connections.member_id')
    
    # Association proxy for Many-to-Many relationship between Users and Connections
    # connections = relationship('Connections', back_populates='owner',
    #                            cascade='all, delete-orphan')
    # members = association_proxy('Connections', 'member')
    
    # Association proxy for Many-to-Many relationship between Users and Matches
    # matches = relationship('MatchNotifications', back_populates='owner',
    #                        cascade='all, delete-orphan')
    # matched_users = association_proxy('Connections', 'matched_user')


class Connections(Base):
    __tablename__ = 'Connections'
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey(Users.id), nullable=False)
    member_id = Column(Integer, ForeignKey(Users.id))
    UniqueConstraint('owner_id', 'member_id')
    
    # Many-to-One relationship between MatchNotifications (Many) to Users (One)
    member = relationship('Users', back_populates='connections', foreign_keys='Connections.member_id')
    
    # Association proxy for Many-to-Many relationship between Users and Connections
    # owner = relationship('Users', back_populates='connections')
    # member = relationship('Users')

    def __repr__(self):
        return f'<Connection(id={self.id}, owner={self.owned_by}, email={self.member})>'


class EventCategories(Base):
    '''
    Table for status of an event.
    Table to be prefilled with the following records:
        1     'Corporate'
        2     'Fundraising'
        3     'Conferences and Workshops'
        4     'Virtual'
        5     'Fandom'
        6     'Festivals and Fairs'
        7     'Food and Drink'
        8     'Networking'
        9     'Hackathons'
        10    'Sports and Tournaments'
    '''
    __tablename__ = 'EventCategories'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    events = relationship('Events', back_populates='category')

    def __repr__(self):
        return f'<EventCategory(id={self.id}, name={self.name})>'

class EventStatus(Base):
    '''
    Table for status of an event.
    Table to be prefilled with the following records:
        1     'Ticket Available'
        2     'Sold Out'
        3     'Finished'
        4     'Postponed'
        5     'Cancelled'
    '''
    __tablename__ = 'EventStatus'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    events = relationship('Events', back_populates='status')
    
    def __repr__(self):
        return f'<EventStatus(id={self.id}, name={self.name})>'


class Events(Base):
    __tablename__ = 'Events'
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String)
    created_by = Column(Integer, ForeignKey(Users.id), nullable=False)
    category_id = Column(Integer, ForeignKey(EventCategories.id))
    location_add = Column(String, nullable=False)
    gps_coord = Column(String)
    photo_url = Column(String)
    start_datetime = Column(DateTime)
    end_datetime = Column(DateTime)
    tags = Column(String)
    age_limit = Column(Integer)
    status_id = Column(Integer, ForeignKey(EventStatus.id), default=1)
    
    @hybrid_property
    def remaining_tickets(self):
        return sum(ticket.total_number for ticket in self.tickets)
    
    @remaining_tickets.expression
    def remaining_tickets(cls):
        return select(func.sum(TicketTypes.total_number)).\
                where(TicketTypes.event_id==cls.id).\
                label('remaing_tickets')
    
    @hybrid_property
    def sold_tickets(self):
        return sum(ticket.sold for ticket in self.tickets)
    
    @sold_tickets.expression
    def sold_tickets(cls):
        return select(func.sum(TicketTypes.sold)).\
                where(TicketTypes.event_id==cls.id).\
                label('sold_tickets')
                
    @hybrid_property
    def total_tickets(self):
        return (self.remaining_tickets + self.sold_tickets)
    
    @hybrid_property
    def nb_of_ratings(self):
        if not self.reviews:
            return None
        nb_of_ratings = len(self.reviews)
        return nb_of_ratings       
    
    @nb_of_ratings.expression
    def nb_of_ratings(cls):       
        nb_of_ratings = select(func.count(Reviews.rating)).where(Reviews.event_id==cls.id).label('nb_of_ratings')
        if not nb_of_ratings:
            return None
        return nb_of_ratings
    
    @hybrid_property
    def average_rating(self):
        if not self.reviews:
            return None
        total_ratings = sum(review.rating for review in self.reviews)
        return (total_ratings/self.nb_of_ratings)
    
    @average_rating.expression
    def average_rating(self, cls):
        total_ratings = select(func.sum(Reviews.rating)).where(Reviews.event_id==cls.id).label('average_rating')
        if not total_ratings:
            return None
        return (total_ratings/self.nb_of_ratings)
    
    @hybrid_property
    def rating_distribution(self):
        if not self.reviews:
            return None
        
        ratings_list = [review.rating for review in self.reviews]
        ratings_dict = {'1': 0, '2': 0, '3': 0, '4': 0, '5': 0}
        for i in ratings_list:
            ratings_dict[i] = ratings_dict.get(i, 0) + 1
        
        ratings_dict.update((x, y/self.nb_of_ratings * 100) for x, y in ratings_dict.items())
        return ratings_dict
    
    # Relationships:
    # Many-to-One relationship between Events (Many) to Users (One)
    owner = relationship('Users', back_populates='events')
    
    # Many-to-One relationship between Events (Many) and EventCategories (One)
    category = relationship('EventCategories', back_populates='events')
    
    # Many-to-One relationship between Events (Many) and Status (One)
    status = relationship('EventStatus', back_populates='events')
    
    # One-to-Many relationship between Events (One) and TicketTypes (Many)
    tickets = relationship('TicketTypes', back_populates='event')
    
    # One-to-Many relationship between Events (One) and Bookings (Many)
    bookings = relationship('Bookings', back_populates='event')
    
    # One-to-Many relationship between Events (One) and Reviews (Many)
    reviews = relationship('Reviews', back_populates='event')
    
    # One-to-Many relationship between Events (One) and EventNotifications (Many)
    changes = relationship('EventNotifications', back_populates='event')
    
    # One-to-Many relationship between Events (One) and Matches (Many)
    matches = relationship('MatchNotifications', back_populates='event')
    
    def __repr__(self):
        return f'<Event(title={self.title}, created_by={self.created_by})>'


class TicketTypes(Base):
    __tablename__ = 'TicketTypes'
    id = Column(Integer, primary_key=True) 
    event_id = Column(Integer, ForeignKey(Events.id), nullable=False)
    ticket_type = Column(String, nullable=False)
    total_number = Column(Integer, nullable=False)
    sold = Column(Integer, default=0)
    price = Column(Float)

    
    # Many-to-One relationship between TicketTypes (Many) to Events (One)
    event = relationship('Events', back_populates='tickets')
    
    # One-to-Many relationship between TicketTypes (One) and BookingDetails (Many)
    booking_details = relationship('BookingDetails', back_populates='ticket_type', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Ticket(id={self.id}, event_id={self.event_id}, ticket_type={self.ticket_type})>'


class Bookings(Base):
    __tablename__ = 'Bookings'
    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey(Users.id), nullable=False)
    event_id = Column(Integer, ForeignKey(Events.id), nullable=False)
    transaction_id = Column(String, nullable=False)
    date_created = Column(DateTime)
    
    # Relationships:
    # Many-to-One relationship between Bookings (Many) to Users (One)
    customer = relationship('Users', back_populates='bookings')
    
    # Many-to-One relationship between Bookings (Many) to Events (One)
    event = relationship('Events', back_populates='bookings')
    
    # One-to-Many relationship between Bookings (One) and BookingDetails (Many)
    booking_details = relationship('BookingDetails', back_populates='booking', cascade='all, delete-orphan')
    
    # Association proxy for Many-to-Many relationship between Bookings and TicketTypes
    # booking_details = relationship('BookingDetails', back_populates='booking', cascade='all, delete-orphan')
    # ticket_types = association_proxy('BookingDetails', 'ticket_type')

    def __repr__(self):
        return f'<Booking(id={self.id},\
                customer_id={self.customer_id},\
                event_id={self.event_id})>'


class BookingDetails(Base):
    __tablename__ = 'BookingDetails'
    id = Column(Integer, primary_key=True)
    booking_id = Column(Integer, ForeignKey(Bookings.id), nullable=False)
    ticket_id = Column(Integer, ForeignKey(TicketTypes.id), nullable=False)
    quantity = Column(Integer, nullable=False)
    
    # Relationships:
    # Many-to-One relationship between BookingDetails (Many) to Bookings (One)
    booking = relationship('Bookings', back_populates='booking_details')
    
    # Many-to-One relationship between BookingDetails (Many) to TicketTypes (One)
    ticket_type = relationship('TicketTypes', back_populates='booking_details')
    
    # Association proxy for Many-to-Many relationship between Bookings and TicketTypes
    # booking = relationship('Bookings', back_populates='booking_details')
    # ticket_type = relationship('TicketTypes')
    

class Reviews(Base):
    __tablename__ = 'Reviews'
    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey(Users.id), nullable=False)    
    event_id = Column(Integer, ForeignKey(Events.id), nullable=False)
    comment = Column(String)
    rating = Column(Integer)
    date_created = Column(DateTime)
    UniqueConstraint('customer_id', 'event_id')
    
    # Relationships:
    # Many-to-One relationship between Reviews (Many) to Users (One)
    customer = relationship('Users', back_populates='reviews')
    
    # Many-to-One relationship between Reviews (Many) to Events (One)
    event = relationship('Events', back_populates='reviews')

    def __repr__(self):
        return f'<Review(id={self.id},\
                event_id={self.event_id},\
                customer_id={self.customer_id},\
                comment={self.comment},\
                rating={self.rating})>'


class EventNotifications(Base):
    __tablename__ = 'EventNotifications'
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Events.id), nullable=False)
    user_id = Column(Integer, ForeignKey(Users.id), nullable=False)
    description = Column(String, default='Details updated')
    date_created = Column(DateTime)
    is_read = Column(Boolean, default=False)
    
    # Many-to-One relationship between EventNotifications (Many) to Events (One)
    event = relationship('Events', back_populates='changes')
    
    def __repr__(self):
        return f'<EventNoti(id={self.id}, event_id={self.event_id})>'

    
class MatchNotifications(Base):
    __tablename__ = 'MatchNotifications'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(Users.id), nullable=False)
    matched_user_id = Column(Integer, ForeignKey(Users.id), nullable=False)
    event_id = Column(Integer, ForeignKey(Events.id), nullable=False)
    date_created = Column(DateTime)
    is_read = Column(Boolean, default=False)
    UniqueConstraint('user_id', 'matched_user_id', 'event_id')
    
    # Many-to-One relationship between MatchNotifications (Many) to Events (One)
    event = relationship('Events', back_populates='matches')
    
    # Many-to-One relationship between MatchNotifications (Many) to Users (One)
    matched_user = relationship('Users', back_populates='matches', foreign_keys='MatchNotifications.matched_user_id')
    
    # Association proxy for Many-to-Many relationship between Users and Matches
    # owner = relationship('Users', back_populates='matches')
    # matched_user = relationship('Users')
    
    def __repr__(self):
        return f'<MatchNoti(id={self.id},\
                event_id={self.event_id},\
                user_id={self.user_id},\
                matched_user_id={self.matched_user_id})>'

    

    