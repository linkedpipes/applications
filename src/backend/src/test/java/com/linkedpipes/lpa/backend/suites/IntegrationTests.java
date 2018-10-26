package com.linkedpipes.lpa.backend.suites;

import com.linkedpipes.lpa.backend.controllers.DiscoveryControllerTests;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({
        DiscoveryControllerTests.class,
})
public class IntegrationTests {
}
