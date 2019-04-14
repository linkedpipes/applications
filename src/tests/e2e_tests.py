import unittest
import time
import os
import sys
import requests
import browserstack_plugins.fast_selenium

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
from selenium.common.exceptions import WebDriverException
from requests.auth import HTTPBasicAuth
from slackclient import SlackClient

desired_cap = {
    'browserName': 'Chrome',
    "browser_version": "73",
    "browserstack.debug": True
    "acceptSslCerts": True
}

slack_token = os.environ["SLACK_API_TOKEN"]
sc = SlackClient(slack_token)


class UntitledTestCase(unittest.TestCase):

    browserstack_username = 'no_username'
    browserstack_access_key = 'no_key'
    pr_repo_title = 'travis_-1'
    build_travis_number = -1

    def setUp(self):
        desired_cap['build'] = self.build_travis_number
        desired_cap['project'] = self.pr_repo_title

        self.driver = webdriver.Remote(
            command_executor='http://{0}:{1}@hub.browserstack.com:80/wd/hub'.format(self.browserstack_username,
                                                                                    self.browserstack_access_key),
            desired_capabilities=desired_cap)
        self.driver.implicitly_wait(30)
        self.accept_next_alert = True
        self.verificationErrors = []

    def wait_for_element_to_be_clickable(self, element_id, timeout=10):
        wd_wait = WebDriverWait(self.driver, timeout)
        element = wd_wait.until(
            EC.element_to_be_clickable((By.ID, element_id)))
        print('WAITING for {0}'.format(element_id))
        return element

    def wait_for_element_to_be_present(self, element_id, timeout=10):
        wd_wait = WebDriverWait(self.driver, timeout)
        element = wd_wait.until(
            EC.presence_of_element_located((By.ID, element_id)))
        print('WAITING for {0}'.format(element_id))
        return element

    def custom_wait_clickable_and_click(self, element_id, attempts=5):
        count = 0
        while count < attempts:
            try:
                time.sleep(5)
                # This will throw an exception if it times out, which is what we want.
                # We only want to start trying to click it once we've confirmed that
                # selenium thinks it's visible and clickable.
                elem = self.wait_for_element_to_be_clickable(
                    element_id=element_id)
                elem.click()

                return elem

            except WebDriverException as e:
                count = count + 1

    def test_google_maps_flow(self):
        driver = self.driver

        driver.get("https://applications.linkedpipes.com/login")
        driver.find_element_by_id("with-web-id-checkbox").click()
        driver.find_element_by_id("webId").click()
        driver.find_element_by_id("webId").clear()
        driver.find_element_by_id("webId").send_keys(
            "https://seleniumlpa.inrupt.net/profile/card#me")
        driver.find_element_by_id(
            "sign-in-button").click()
        driver.find_element_by_id("username").click()
        driver.find_element_by_id("username").clear()
        driver.find_element_by_id("username").send_keys("seleniumlpa")
        driver.find_element_by_id("password").click()
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("Selenium123!")
        driver.find_element_by_id("login").click()

        self.custom_wait_clickable_and_click(
            element_id="googlemaps-sample-home-button")

        self.custom_wait_clickable_and_click(
            element_id="start-discovery-button")

        self.custom_wait_clickable_and_click(element_id="visualizer-0-card")

        self.custom_wait_clickable_and_click(element_id="button-2-pipeline")

        self.custom_wait_clickable_and_click(element_id="create-app-button")

        self.custom_wait_clickable_and_click("application-title-field")
        driver.find_element_by_id("application-title-field").clear()
        driver.find_element_by_id(
            "application-title-field").send_keys("Test selenium gmaps app")
        driver.find_element_by_id("create-app-publish-button").click()

        self.custom_wait_clickable_and_click("browse-published-button")

        driver.find_element_by_xpath(
            "(.//*[normalize-space(text()) and normalize-space(.)='LPApps Storage'])[1]/following::button[2]").click()
        driver.find_element_by_xpath(
            "(.//*[normalize-space(text()) and normalize-space(.)='Dashboard'])[1]/following::div[1]").click()
        driver.find_element_by_xpath(
            "(.//*[normalize-space(text()) and normalize-space(.)='LPApps Storage'])[1]/following::button[1]").click()
        driver.find_element_by_xpath(
            "(.//*[normalize-space(text()) and normalize-space(.)='Share'])[1]/following::li[1]").click()

    def test_chord_flow(self):
        driver = self.driver

        driver.get("https://applications.linkedpipes.com/login")
        driver.find_element_by_id("with-web-id-checkbox").click()
        driver.find_element_by_id("webId").click()
        driver.find_element_by_id("webId").clear()
        driver.find_element_by_id("webId").send_keys(
            "https://seleniumlpa.inrupt.net/profile/card#me")
        driver.find_element_by_id(
            "sign-in-button").click()
        driver.find_element_by_id("username").click()
        driver.find_element_by_id("username").clear()
        driver.find_element_by_id("username").send_keys("seleniumlpa")
        driver.find_element_by_id("password").click()
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("Selenium123!")
        driver.find_element_by_id("login").click()

        self.custom_wait_clickable_and_click(
            element_id="chord-sample-home-button")

        self.custom_wait_clickable_and_click(
            element_id="start-discovery-button")

        self.custom_wait_clickable_and_click(element_id="visualizer-0-card")

        self.custom_wait_clickable_and_click(element_id="button-0-pipeline")

        self.custom_wait_clickable_and_click(element_id="create-app-button")

        self.custom_wait_clickable_and_click("application-title-field")
        driver.find_element_by_id("application-title-field").clear()
        driver.find_element_by_id(
            "application-title-field").send_keys("Test selenium chord app")
        driver.find_element_by_id("create-app-publish-button").click()

        self.custom_wait_clickable_and_click("browse-published-button")

        driver.find_element_by_xpath(
            "(.//*[normalize-space(text()) and normalize-space(.)='LPApps Storage'])[1]/following::button[2]").click()
        driver.find_element_by_xpath(
            "(.//*[normalize-space(text()) and normalize-space(.)='Dashboard'])[1]/following::div[1]").click()
        driver.find_element_by_xpath(
            "(.//*[normalize-space(text()) and normalize-space(.)='LPApps Storage'])[1]/following::button[1]").click()
        driver.find_element_by_xpath(
            "(.//*[normalize-space(text()) and normalize-space(.)='Share'])[1]/following::li[1]").click()

    def is_element_present(self, how, what):
        try:
            self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e:
            return False
        return True

    def is_alert_present(self):
        try:
            self.driver.switch_to.alert()
        except NoAlertPresentException as e:
            return False
        return True

    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to.alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally:
            self.accept_next_alert = True

    def tearDown(self):

        self.driver.quit()

        session_id = self.driver.session_id
        session_info = requests.get(url='https://api.browserstack.com/automate/sessions/{0}.json'.format(session_id),
                                    auth=HTTPBasicAuth(self.browserstack_username, self.browserstack_access_key)).json()

        project_name = session_info['automation_session']['project_name']
        build_name = session_info['automation_session']['build_name']
        browser = session_info['automation_session']['browser']
        browser_version = session_info['automation_session']['browser_version']
        os_name = session_info['automation_session']['os']
        os_version = session_info['automation_session']['os_version']
        public_url = session_info['automation_session']['public_url']

        sc.api_call(
            "chat.postMessage",
            channel="CGGD5F3FY",
            text="E2E tests on LPA were performed :tada: \n\n See results:\n"
                 "```project_name: {0}\n"
                 "build_name: {1}\n"
                 "browser: {2} {3}\n"
                 "os: {4} {5}\n"
                 "url: {6}```".format(project_name, build_name, browser,
                                      browser_version, os_name, os_version, public_url)
        )

        self.assertEqual([], self.verificationErrors)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        UntitledTestCase.pr_repo_title = 'travis_on_{0}'.format(sys.argv.pop())
        UntitledTestCase.build_travis_number = 'travis_{0}'.format(
            sys.argv.pop())
        UntitledTestCase.browserstack_access_key = sys.argv.pop()
        UntitledTestCase.browserstack_username = sys.argv.pop()

    unittest.main()
