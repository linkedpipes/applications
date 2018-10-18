package com.linkedpipes.lpa.backend.suites;

import com.linkedpipes.lpa.backend.controllers.DiscoveryControllerTests;
import com.linkedpipes.lpa.backend.services.DiscoveryServiceComponentTests;
import com.linkedpipes.lpa.backend.services.EtlServiceComponentTests;
import com.linkedpipes.lpa.backend.services.TtlConfigGeneratorTests;
import com.linkedpipes.lpa.backend.util.HttpRequestSenderTests;
import com.linkedpipes.lpa.backend.util.UrlUtilsTests;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({
        UrlUtilsTests.class,
        HttpRequestSenderTests.class,
        DiscoveryServiceComponentTests.class,
        EtlServiceComponentTests.class,
        TtlConfigGeneratorTests.class,
        DiscoveryControllerTests.class,
})
public class UnitTests {
}
