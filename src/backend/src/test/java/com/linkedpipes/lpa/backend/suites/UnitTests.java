package com.linkedpipes.lpa.backend.suites;

import com.linkedpipes.lpa.backend.util.HttpRequestSenderTests;
import com.linkedpipes.lpa.backend.util.UrlUtilsTests;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({
        UrlUtilsTests.class,
        HttpRequestSenderTests.class,
})
public class UnitTests {
}
