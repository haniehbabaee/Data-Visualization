#!/usr/bin/env python
# coding: utf-8

# In[109]:


import pandas as pd
from bs4 import BeautifulSoup as bs
import splinter
import requests
import json
import pymongo
from splinter import Browser
import time


# In[2]:

def init_browser():
    executable_path = {'executable_path': 'chromedriver.exe'}
    return Browser('chrome', **executable_path)


# # NASA Mars News

# In[3]:

def scrape_all():
    browser = init_browser()
    url = 'https://mars.nasa.gov/news/'
    browser.visit(url)
    time.sleep(1)
    html = browser.html


# In[4]:


    soup = bs(html, "html.parser")
    # print(soup.prettify())


# In[5]:


    content = soup.find("div", class_ = 'content_page')


# In[6]:


    titles = content.find_all("div", class_= 'content_title')
    news_title=titles[0].text.strip()
  


# In[7]:


    article_text = content.find_all("div", class_ = "article_teaser_body")
    news_p= article_text[0].text
    


# # JPL Mars Space Images - Featured Image

# In[14]:


    url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(url)
    time.sleep(1)
    html = browser.html


# In[15]:


    browser.find_by_id("full_image").click()


# In[16]:


    browser.find_by_text("more info     ").click()


# In[18]:


    soup = bs(browser.html, "html.parser")
    featured_img = soup.find("img", class_="main_image")["src"]
    

# In[19]:


    former=url.split('?')[0]
    


# In[20]:


    latter=featured_img.split('/spaceimages/')[1]
    


# In[21]:


    featured_image_url= former+latter
    


# # Mars Facts

# In[22]:


    url = 'https://space-facts.com/mars/'
    # Extract tables
    dfs = pd.read_html(url)
    


# In[114]:


    mars_df= dfs[0]
    mars_df.columns=["Description", "Mars"]
    mars_df= mars_df.set_index('Description')


# In[116]:


    planet_facts_table_html = mars_df.to_html()
    


# # Mars Hemispheres

# In[105]:


    url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    browser.visit(url)
    time.sleep(1)
    html = browser.html


# In[106]:


    hemisphere_image_urls=[]

    links = browser.find_by_css("a.product-item h3")
    for i in range(len(links)):
        hemispheres={}
        browser.find_by_css("a.product-item h3")[i].click()
        soup = bs(browser.html, "html.parser")
        title= soup.find("h2", class_="title").text
        link=soup.find('div',class_='downloads')
        img_url=link.find("a")['href']
    
        hemispheres["title"]=title
        hemispheres["img_url"]=img_url

        hemisphere_image_urls.append(hemispheres)
        browser.back()


# In[107]:

  
    
  


# In[122]:


    mars_data={'news_title': news_title,
        'news_p': news_p,
        'featured_image_url': featured_image_url,
        'planet_facts_table_html': planet_facts_table_html,
        'hemisphere_image_urls' : hemisphere_image_urls}
    
   

# In[ ]:
    # Close the browser after scraping
    browser.quit()

    # Return results
    return mars_data




