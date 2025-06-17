from django.urls import path,include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'forms', FormViewSet)
router.register(r'form_responses', FormResponseViewSet)

urlpatterns = [
    path('', include(router.urls)),

    path('layout/navbar/', NavbarView.as_view(), name='navbar'),
    path('layout/footer/', FooterView.as_view(), name='footer'),


    path('home/carousel/', CarouselView.as_view(), name='carousel'),
    path('home/hero/', HeroView.as_view(), name='hero'),

    path('home/new/', NewView.as_view(), name='new'),


    path('home/cards/', CardsView.as_view(), name='cards'),
    path('home/services/', ServicesView.as_view(), name='services'),
    path('home/statistics/', StatisticsView.as_view(), name='statistics'),
    path('home/timeline/', TimelineView.as_view(), name='timeline'),
    path('home/why-us/', WhyUsView.as_view(), name='why_us'),
    path('home/our-clients/', OurClientsView.as_view(), name='our_clients'),
    path('home/associates/', AssociatesView.as_view(), name='associates'),
    path('home/about-preview/', AboutPreview.as_view(), name='aboutpreview'),
    path('home/testimonials/', Testimonials.as_view(), name='testimonials'),
    path('home/contacts/', Contact.as_view(), name='contact'),
    path('home/client-logos/', ClietLogos.as_view(), name='client_logos'),
    path('home/our-client/', OurClientView.as_view(), name='client'),
    path('our-concern/home/', OurconcernHome.as_view(), name='our-concern-home'),
    # path('our-concern/h/', OurConcernHomeView.as_view(), name='our-concern-detail'),
    path('home/clients/', ClientView.as_view(), name='client-home'),

    path('home/industries/', IndustriesView.as_view(), name='news'),
    path('home/contact/', ContactView.as_view(), name='contact'),
    path('home/location/', LocationView.as_view(), name='location'),
    path('home/featured-video/', FeaturedVideoView.as_view(), name='featured_video'),
    path('our-concern/', Ourconcern.as_view(), name='our-concern'),
    # path('company-values/', CompanyValues.as_view(), name='our-concern'),
    path('company-values/', CompanyValues.as_view(), name='our-concern'),
    path('our-strength/', OurStrengthView.as_view(), name='our-strength'),
    path('our-service/', OurServiceView.as_view(), name='our-service'),
    path('our-responsibility/', OurResponsibilities.as_view(), name='our-responsibilities'),
    

    # About Section
    path('about/description/', About1View.as_view(), name='about1'),
    path('about/about2/', About2View.as_view(), name='about2'),
    path('chairman-message/', MessageView.as_view(), name='message'),
    path('core-values/', CoreValuesView.as_view(), name='core_values'),
    path('directors/', TeamView.as_view(), name='team'),

    # Contact Section
    path('contact/contact1/', Contact1View.as_view(), name='contact1'),
    path('contact/contact2/', Contact2View.as_view(), name='contact2'),

    # Projects Section
    path('projects/', ProjectsView.as_view(), name='projects'),

    # Service Section
    path('service/service-list/', ServiceListView.as_view(), name='servicelist'),
    path('service-description/', ServiceCardView.as_view(), name='servicecard'),
    path('service-model/', ServicemodelView.as_view(), name='servicemodel'),


      # Projects Section
    path('services/', ServicesPageView.as_view(), name='services-pages'),
    path('project/project-gallery/', ProjectGallery.as_view(), name='project_gallery'),
    path('project/project-card/', ProjectCard.as_view(), name='project_card'),

    # sustainability
    path('sustainability/', Sustainability.as_view(), name='sustainability'),

    # career Info
    path('career/', Career.as_view(), name='career'),


    # news and events
    path('news-events-description/', DescriptionView.as_view(), name='description'),
    path('recruitment/', RecruitmentView.as_view(), name='recruitment'),
    path('news-events/', NewsEventsView.as_view(), name='news-events'),
   

   # QuoteForm
   path('quote/', QuoteForm.as_view(), name='quote'),



 # Projects Section
    path('gallery/', GalleryView.as_view(), name='projects'),

    path('get-service-slugs/', get_service_slugs, name='get_service_slugs'),

   path('contact-messages/', ContactMessageListCreate.as_view(), name='contact-message-list'),
    path('contact-messages/<int:pk>/', ContactMessageDetail.as_view(), name='contact-message-detail'),

    # MEDICAL REPORTS AND FORMS 

  
    # Medical Reports
        path('job-applications/', JobApplicationListCreateView.as_view(), name='job-applications'),

        path('images/', UploadedImageViewSet.as_view(), name='image-list-create'),
      path('images/<int:pk>/', RetrieveImage.as_view(), name='image-retrive'),
    

 
    ]

