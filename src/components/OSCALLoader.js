import React, { useState, useEffect, useRef } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Split from "react-split";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Fab } from "@material-ui/core";
import CodeIcon from "@material-ui/icons/Code";
import { populatePartialRestData } from "./oscal-utils/OSCALUtils";
import ErrorBoundary, { BasicError } from "./ErrorBoundary";
import OSCALSsp from "./OSCALSsp";
import OSCALCatalog from "./OSCALCatalog";
import OSCALComponentDefinition from "./OSCALComponentDefinition";
import OSCALProfile from "./OSCALProfile";
import OSCALLoaderForm from "./OSCALLoaderForm";
import OSCALJsonEditor from "./OSCALJsonEditor";

const oscalObjectTypes = {
  catalog: {
    name: "Catalog",
    defaultUrl:
      "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/catalogs/NIST_SP-800-53_rev5_catalog.json",
    defaultUuid: "613fca2d-704a-42e7-8e2b-b206fb92b456",
    jsonRootName: "catalog",
    restPath: "catalogs",
  },
  component: {
    name: "Component",
    defaultUrl:
      "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/component-definitions/example-component.json",
    defaultUuid: "8223d65f-57a9-4689-8f06-2a975ae2ad72",
    jsonRootName: "component-definition",
    restPath: "component-definitions",
  },
  profile: {
    name: "Profile",
    defaultUrl:
      "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/profiles/NIST_SP-800-53_rev4_MODERATE-baseline_profile.json",
    defaultUuid: "8b3beca1-fcdc-43e0-aebb-ffc0a080c486",
    jsonRootName: "profile",
    restPath: "profiles",
  },
  ssp: {
    name: "SSP",
    defaultUrl:
      "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/system-security-plans/ssp-example.json",
    defaultUuid: "cff8385f-108e-40a5-8f7a-82f3dc0eaba8",
    jsonRootName: "system-security-plan",
    restPath: "system-security-plans",
  },
};

const useStyles = makeStyles((theme) => ({
  split: {
    display: "flex",
    flexDirection: " row",
    "& > .gutter": {
      backgroundColor: "#eee",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "50%",
      "&.gutter-horizontal": {
        backgroundImage:
          "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==')",
        cursor: "col-resize",
      },
    },
  },
  toolbar: {
    position: "sticky",
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: theme.spacing(1),
    zIndex: 1,
  },
}));

export default function OSCALLoader(props) {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isResolutionComplete, setIsResolutionComplete] = useState(false);
  const { isRestMode, setIsRestMode } = props;
  const [oscalData, setOscalData] = useState([]);
  const [oscalUrl, setOscalUrl] = useState(isRestMode ? null : props.oscalUrl);
  const [editorIsVisible, setEditorIsVisible] = useState(true);
  const unmounted = useRef(false);
  const [error, setError] = useState(null);
  // We "count" the number of times the reload button has been pressed (when active).
  // This will force a redraw of the form on each click, allowing us to reset after
  // an error and to ensure.
  const [reloadCount, setReloadCount] = useState(0);

  const handleFetchError = (err) => {
    setIsLoaded(true);
    setIsResolutionComplete(true);
    setError(err);
  };

  const loadOscalData = (newOscalUrl) => {
    if (!newOscalUrl) {
      setIsLoaded(true);
      return;
    }
    fetch(newOscalUrl)
      .then(
        (response) => {
          if (!response.ok) throw new Error(response.status);
          else return response.json();
        },
        (err) => handleFetchError(err)
      )
      .then(
        (result) => {
          if (!unmounted.current) {
            // TODO https://github.com/EasyDynamics/oscal-react-library/issues/297
            /* eslint no-param-reassign: "error" */
            result.oscalSource = JSON.stringify(result, null, "\t");
            setOscalData(result);
            setIsLoaded(true);
          }
        },
        (err) => handleFetchError(err)
      );
  };

  /**
   * Sends a REST request of type restMethod to a backend service and updates the viewer if
   * the request is successful.
   *
   * @param appendToLastFieldInPath boolean indicating if the updated value should be appended to an array or replace an existing value
   * @param partialRestData data that will be passed into the body of the REST request, may not initially contain the updates
   * @param editedFieldJsonPath path to the field that is being updated
   * @param newValue updated value for the edited field
   * @param httpMethod the HTTP request type
   * @param restUrlPath path defining where in the file the modifications are made
   * @param jsonRootName root OSCAL object, as it appears on the corresponding object file, of the JSON file
   * @param restPath main url path for access the OSCAL files in REST mode
   */
  const handleRestRequest = (
    appendToLastFieldInPath,
    partialRestData,
    editedFieldJsonPath,
    newValue,
    httpMethod,
    restUrlPath,
    jsonRootName = null,
    restPath = null
  ) => {
    let url;
    if (!restUrlPath || restUrlPath === "") {
      url = `${process.env.REACT_APP_REST_BASE_URL}/${restPath}/${partialRestData[jsonRootName].uuid}`;
    } else if (restUrlPath.startsWith("http", 0)) {
      url = restUrlPath;
    } else {
      url = `${process.env.REACT_APP_REST_BASE_URL}/${restUrlPath}`;
    }
    if (newValue) {
      populatePartialRestData(
        partialRestData,
        editedFieldJsonPath,
        newValue,
        appendToLastFieldInPath
      );
    }

    setIsLoaded(false);
    setIsResolutionComplete(false);

    const requestInfo = {
      method: httpMethod,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(partialRestData),
    };

    fetch(url, requestInfo)
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(
        (result) => {
          if (!unmounted.current) {
            result.oscalSource = JSON.stringify(result, null, "\t");
            setOscalData(result);
            setIsLoaded(true);
          }
        },
        (err) => handleFetchError(err)
      );
  };

  const handleUrlChange = (event) => {
    setOscalUrl(event.target.value);
  };

  const handleUuidChange = (event) => {
    const newOscalUrl = `${props.backendUrl}/${props.oscalObjectType.restPath}/${event.target.value}`;
    setOscalUrl(newOscalUrl);
    setIsLoaded(false);
    setIsResolutionComplete(false);
    loadOscalData(newOscalUrl);
  };

  const handleReloadClick = () => {
    // Only reload if we're done loading
    if (isLoaded && isResolutionComplete) {
      setIsLoaded(false);
      setIsResolutionComplete(false);
      setReloadCount((current) => current + 1);
      loadOscalData(oscalUrl);
    }
  };

  const handleChangeRestMode = (event) => {
    setIsRestMode(event.target.checked);
    if (event.target.checked) {
      setOscalUrl(null);
      setIsLoaded(true);
      setIsResolutionComplete(true);
    } else {
      setIsLoaded(false);
      setIsResolutionComplete(false);
      setOscalUrl(props.oscalObjectType.defaultUrl);
      loadOscalData(props.oscalObjectType.defaultUrl);
    }
  };

  const handleRestPut = (jsonString) => {
    handleRestRequest(
      false,
      JSON.parse(jsonString),
      null,
      null,
      "PUT",
      oscalUrl
    );
  };

  const onResolutionComplete = () => {
    setIsResolutionComplete(true);
  };

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    loadOscalData(oscalUrl);

    return () => {
      unmounted.current = true;
    };
  }, []);

  let form;
  if (props.renderForm) {
    form = (
      <OSCALLoaderForm
        oscalObjectType={props.oscalObjectType}
        oscalUrl={oscalUrl}
        onUrlChange={handleUrlChange}
        onUuidChange={handleUuidChange}
        onReloadClick={handleReloadClick}
        isRestMode={isRestMode}
        onChangeRestMode={handleChangeRestMode}
        isResolutionComplete={isResolutionComplete}
        onError={handleFetchError}
        backendUrl={props.backendUrl}
      />
    );
  }

  let result;
  if (error) {
    result = <BasicError error={error} />;
  } else if (!isLoaded) {
    result = <CircularProgress />;
  } else if (oscalUrl) {
    result = isRestMode ? (
      <>
        <Box className={classes.toolbar}>
          <Fab
            aria-label="show code"
            color={editorIsVisible ? "default" : "primary"}
            size="small"
            onClick={() => {
              setEditorIsVisible(!editorIsVisible);
            }}
          >
            <CodeIcon />
          </Fab>
        </Box>
        <Split
          className={classes.split}
          gutterSize={editorIsVisible ? 10 : 0}
          minSize={editorIsVisible ? 300 : 0}
          sizes={editorIsVisible ? [34, 66] : [0, 100]}
        >
          <Box display={editorIsVisible ? "block" : "none"}>
            <OSCALJsonEditor
              value={oscalData.oscalSource}
              onSave={handleRestPut}
            />
          </Box>
          <Box>
            {props.renderer(
              isRestMode,
              oscalData,
              oscalUrl,
              onResolutionComplete,
              handleRestRequest
            )}
          </Box>
        </Split>
      </>
    ) : (
      <>
        {props.renderer(
          isRestMode,
          oscalData,
          oscalUrl,
          onResolutionComplete,
          handleRestRequest
        )}
      </>
    );
  }

  return (
    <>
      {form}
      <ErrorBoundary
        key={reloadCount}
        onError={() => {
          setIsLoaded(true);
          setIsResolutionComplete(true);
        }}
      >
        {result}
      </ErrorBoundary>
    </>
  );
}

/**
 * Returns url parameter provided by the browser url, if it exists. If the url
 * parameter exists, we want to override the default viewer url.
 *
 * @returns The url parameter of the browser url, or null if it doesn't exist
 */
export function getRequestedUrl() {
  return new URLSearchParams(window.location.search).get("url");
}

export function OSCALCatalogLoader(props) {
  const oscalObjectType = oscalObjectTypes.catalog;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    handleRestRequest
  ) => (
    <OSCALCatalog
      catalog={oscalData[oscalObjectType.jsonRootName]}
      parentUrl={oscalUrl}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(
        appendToLastFieldInPath,
        data,
        editedField,
        newValue,
        restMethod,
        restUrlPath
      ) => {
        handleRestRequest(
          appendToLastFieldInPath,
          data,
          editedField,
          newValue,
          restMethod,
          restUrlPath,
          oscalObjectType.jsonRootName,
          oscalObjectType.restPath
        );
      }}
      restPath={oscalObjectType.restPath}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalUrl={getRequestedUrl() || oscalObjectType.defaultUrl}
      renderer={renderer}
      renderForm={props.renderForm}
      backendUrl={props.backendUrl}
      isRestMode={props.isRestMode}
      setIsRestMode={props.setIsRestMode}
    />
  );
}

export function OSCALSSPLoader(props) {
  const oscalObjectType = oscalObjectTypes.ssp;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    handleRestRequest
  ) => (
    <OSCALSsp
      system-security-plan={oscalData[oscalObjectType.jsonRootName]}
      isEditable={isRestMode}
      parentUrl={oscalUrl}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(
        appendToLastFieldInPath,
        data,
        editedField,
        newValue,
        restMethod,
        restUrlPath
      ) => {
        handleRestRequest(
          appendToLastFieldInPath,
          data,
          editedField,
          newValue,
          restMethod,
          restUrlPath,
          oscalObjectType.jsonRootName,
          oscalObjectType.restPath
        );
      }}
      restPath={oscalObjectType.restPath}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalUrl={getRequestedUrl() || oscalObjectType.defaultUrl}
      renderer={renderer}
      renderForm={props.renderForm}
      backendUrl={props.backendUrl}
      isRestMode={props.isRestMode}
      setIsRestMode={props.setIsRestMode}
    />
  );
}

export function OSCALComponentLoader(props) {
  const oscalObjectType = oscalObjectTypes.component;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    handleRestRequest
  ) => (
    <OSCALComponentDefinition
      componentDefinition={oscalData[oscalObjectType.jsonRootName]}
      parentUrl={oscalUrl}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(
        appendToLastFieldInPath,
        data,
        editedField,
        newValue,
        restMethod,
        restUrlPath
      ) => {
        handleRestRequest(
          appendToLastFieldInPath,
          data,
          editedField,
          newValue,
          restMethod,
          restUrlPath,
          oscalObjectType.jsonRootName,
          oscalObjectType.restPath
        );
      }}
      restPath={oscalObjectType.restPath}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalUrl={getRequestedUrl() || oscalObjectType.defaultUrl}
      renderer={renderer}
      renderForm={props.renderForm}
      backendUrl={props.backendUrl}
      isRestMode={props.isRestMode}
      setIsRestMode={props.setIsRestMode}
    />
  );
}

export function OSCALProfileLoader(props) {
  const oscalObjectType = oscalObjectTypes.profile;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    handleRestRequest
  ) => (
    <OSCALProfile
      profile={oscalData[oscalObjectType.jsonRootName]}
      parentUrl={oscalUrl}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(
        appendToLastFieldInPath,
        data,
        editedField,
        newValue,
        restMethod,
        restUrlPath
      ) => {
        handleRestRequest(
          appendToLastFieldInPath,
          data,
          editedField,
          newValue,
          restMethod,
          restUrlPath,
          oscalObjectType.jsonRootName,
          oscalObjectType.restPath
        );
      }}
      restPath={oscalObjectType.restPath}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalUrl={getRequestedUrl() || oscalObjectType.defaultUrl}
      renderer={renderer}
      renderForm={props.renderForm}
      backendUrl={props.backendUrl}
      isRestMode={props.isRestMode}
      setIsRestMode={props.setIsRestMode}
    />
  );
}
