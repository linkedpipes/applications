package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.util.HashableTuple;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ValueConstants;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.util.DefaultUriBuilderFactory;

import java.lang.reflect.Method;
import java.net.URI;
import java.util.*;
import java.util.function.Predicate;

import static java.util.stream.Collectors.*;

@Service
public class HandlerMethodIntrospector extends RequestMappingHandlerMapping {

    private final Map<HashableTuple, HandlerMethodInfo> mappingInfoMap = new HashMap<>();

    @Override
    @Nullable
    protected RequestMappingInfo getMappingForMethod(@NotNull Method method, @NotNull Class<?> handlerType) {
        RequestMappingInfo mappingForMethod = super.getMappingForMethod(method, handlerType);

        if (mappingForMethod != null) {
            HashableTuple key = new HashableTuple(handlerType, method);
            HandlerMethodInfo value = new HandlerMethodInfo(mappingForMethod, method);
            mappingInfoMap.put(key, value);
        }

        return mappingForMethod;
    }

    public HandlerMethodUriBuilder getHandlerMethodUri(Class<?> controllerClass, Method handlerMethod) {
        HandlerMethodInfo methodInfo = mappingInfoMap.get(new HashableTuple(controllerClass, handlerMethod));
        if (methodInfo == null) {
            throw new IllegalArgumentException("No handler method info found for:" +
                    "\n\tclass: " + controllerClass.getName() +
                    "\n\tmethod: " + handlerMethod.getName());
        }

        int uriPatterns = methodInfo.getUriPatterns().size();
        if (uriPatterns != 1) {
            throw new IllegalArgumentException(
                    String.format("The handler method has a wrong number of patterns, expected: %d, found %d.", 1, uriPatterns));
        }

        return new HandlerMethodUriBuilder(methodInfo);
    }

    private static class HandlerMethodInfo  {
        @NotNull
        private final Set<String> uriPatterns;
        @NotNull
        private final Set<RequestParam> requestParams;

        HandlerMethodInfo(@NotNull RequestMappingInfo info, Method method) {
            uriPatterns = Collections.unmodifiableSet(info.getPatternsCondition().getPatterns());
            requestParams = Arrays.stream(method.getParameters())
                    .map(parameter -> AnnotatedElementUtils.findMergedAnnotation(parameter, RequestParam.class))
                    .filter(Objects::nonNull)
                    .collect(toUnmodifiableSet());
        }

        @NotNull
        String getUriPattern() {
            return uriPatterns.iterator().next();
        }

        @NotNull
        Set<String> getUriPatterns() {
            return uriPatterns;
        }

        @NotNull
        Set<RequestParam> getRequestParams() {
            return requestParams;
        }
    }

    public static class HandlerMethodUriBuilder {
        @NotNull
        private final HandlerMethodInfo methodInfo;
        @NotNull
        private final Map<String, Object> pathVariables = new LinkedHashMap<>();
        @NotNull
        private final MultiValueMap<String, String> requestParams = new LinkedMultiValueMap<>();

        HandlerMethodUriBuilder(@NotNull HandlerMethodInfo methodInfo) {
            this.methodInfo = methodInfo;
        }

        @NotNull
        public HandlerMethodUriBuilder pathVariable(@NotNull String key, @NotNull Object value) {
            if (!methodInfo.getUriPattern().contains("{" + key + "}")) {
                throw new IllegalArgumentException("Path variable with key \"" + key + "\" not found");
            }

            pathVariables.put(key, value);
            return this;
        }

        @NotNull
        public HandlerMethodUriBuilder requestParam(@NotNull String key, @NotNull Object... values) {
            if (methodInfo.getRequestParams()
                    .stream()
                    .map(RequestParam::name)
                    .noneMatch(Predicate.isEqual(key))) {
                throw new IllegalArgumentException("Request parameter with key \"" + key + "\" not found");
            }

            List<String> strings = Arrays.stream(values)
                    .map(String::valueOf)
                    .collect(toList());
            requestParams.addAll(key, strings);
            return this;
        }

        @NotNull
        public URI build() {
            Set<String> unassignedParams = getUnassignedParams();
            if (!unassignedParams.isEmpty()) {
                String quotedJoinedParams = unassignedParams.stream()
                        .map(s -> "\"" + s + "\"")
                        .collect(joining(", "));
                throw new IllegalStateException("Some required request params were not assigned a value: " + quotedJoinedParams);
            }

            String hostUri = Application.getConfig().getString("lpa.hostUrl");
            String methodUriPath = methodInfo.getUriPattern();
            return new DefaultUriBuilderFactory()
                    .uriString(hostUri + methodUriPath)
                    .queryParams(requestParams)
                    .build(pathVariables);
        }

        @NotNull
        private Set<String> getUnassignedParams() {
            return methodInfo.getRequestParams()
                    .stream()
                    .filter(this::isUnassigned)
                    .map(RequestParam::name)
                    .collect(toUnmodifiableSet());
        }

        private boolean isUnassigned(RequestParam requestParam) {
            return requestParam.required() &&
                    Objects.equals(requestParam.defaultValue(), ValueConstants.DEFAULT_NONE) &&
                    !requestParams.containsKey(requestParam.name());
        }
    }

}
