/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import { Icon, InlineIcon } from '@iconify/react';
import { EventInput } from '@fullcalendar/common';
import { makeStyles } from '@material-ui/core/styles';
// material
import CloseIcon from '@material-ui/icons/Close';
import eyeFill from '@iconify/icons-eva/eye-fill';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Card,
  Grid,
  Stack,
  Typography,
  FormLabel,
  IconButton,
  Dialog,
  DialogContent,
  CircularProgress,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AccordionActions,
  Button,
  Chip,
  Divider
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import mdiVideoPlusOutline from '@iconify/icons-mdi/video-plus-outline';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { getResource, deleteResource } from '../../redux/slices/calendar';
// @types
import { ResourceManager } from '../../@types/common';
// hooks
import useAuth from '../../hooks/useAuth';
import EmptyContent from '../../components/EmptyContent';

// ----------------------------------------------------------------------

type ViewResourceProps = {
  eventId?: string;
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  legend: {
    paddingTop: 8
  },
  links: {
    marginBottom: 10
  },
  loader: {
    textAlign: 'center'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20
  },
  details: {
    alignItems: 'center'
  },
  column: {
    flexBasis: '33.33%'
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2)
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  linkGroup: {
    marginTop: 10,
    marginBottom: 10
  }
}));

export interface DialogTitleProps {
  id: string;
  children: React.ReactNode | string;
  onClose: () => void;
}

const DialogTitle = (props: DialogTitleProps) => {
  const classes = useStyles();
  const { children, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

export default function ViewResource({ eventId }: ViewResourceProps) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { user } = useAuth();
  const { events } = useSelector((state: RootState) => state.calendar);
  const [resourceLinks, setResourceLinks] = useState<string[]>([]);
  const [eventDetails, setEventDetails] = useState<EventInput>({});
  const [currentResource, setCurrentResource] = useState<ResourceManager>();
  const [resourceList, setResourceList] = useState<ResourceManager[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open && eventId) {
      setLoading(true);
      dispatch(getResource(eventId)).then((response) => {
        if (response?.data?.result) {
          const resourceDetails = response?.data?.result?.[0];
          setCurrentResource(resourceDetails);
          setResourceList(response?.data?.result);
        } else if (!response) {
          handleClose();
          enqueueSnackbar('Error fetching resources', { variant: 'error' });
        }
      });
      setLoading(false);
    }
  }, [open, eventId, dispatch]);

  useEffect(() => {
    if (open && events?.length > 0 && currentResource && Object.keys(eventDetails).length === 0) {
      setLoading(true);
      const details = events.find((event) => event.eventId === currentResource?.eventId);
      if (details) {
        setEventDetails(details);
      }
      setLoading(false);
    }
  }, [open, events, currentResource, eventDetails]);

  // eslint-disable-next-line consistent-return
  const parseLinks = (array: string[]) => {
    if (array?.length > 0) {
      const links = JSON.parse(array[0]);
      return (
        <>
          {links?.length !== 0 && (
            <div className={classes.linkGroup}>
              <Typography className={classes.heading}>Links:</Typography>
              {links?.map((link: string, index: number) => (
                <Typography key={`${link + index}`} className={classes.secondaryHeading}>
                  <a rel="noreferrer" href={link} target="_blank">
                    {link}
                  </a>
                </Typography>
              ))}
            </div>
          )}
        </>
      );
    }
  };

  const resourceDelete = (id?: string) => {
    if (id) {
      setIsLoading(true);
      dispatch(deleteResource(id)).then((response) => {
        if (response?.data?.statusCode) {
          setResourceList((resourceList) => resourceList.filter((list) => list.resourceId !== id));
          enqueueSnackbar('Resources Deleted', { variant: 'success' });
          setIsLoading(false);
        }
      });
    }
  };

  return (
    <div>
      <div onClick={handleClickOpen} style={{ display: 'flex', justifyContent: 'start' }}>
        <Icon icon={eyeFill} width={24} height={24} /> View
      </div>
      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          View Resources {eventDetails?.eventName ? `: ${eventDetails?.eventName}` : ''}
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <div className={classes.loader}>
              <CircularProgress color="primary" />
            </div>
          ) : (
            <div>
              {resourceList &&
                resourceList.map((resource, index) => (
                  <Accordion key={index} defaultExpanded={index === 0}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1c-content"
                      id="panel1c-header"
                    >
                      <div className={classes.column}>
                        <Typography className={classes.heading}>{resource.resourceName}</Typography>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                      <Typography className={classes.heading}>Video:</Typography>
                      <Typography className={classes.secondaryHeading}>
                        <span>
                          {/* <InlineIcon icon={mdiVideoPlusOutline} height={22} /> */}
                          <a rel="noreferrer" href={resource.resource} target="_blank">
                            {resource.resource}
                          </a>
                        </span>
                      </Typography>
                      {parseLinks(resource?.resourceLinks)}
                    </AccordionDetails>
                    <Divider />
                    {(user?.id === resource.uploaderId || user?.role === 'Super Admin') && (
                      <AccordionActions>
                        <Button
                          onClick={() => resourceDelete(resource.resourceId)}
                          size="small"
                          color="error"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                      </AccordionActions>
                    )}
                  </Accordion>
                ))}
              {resourceList?.length === 0 && <EmptyContent title="No Resources Found Yet" />}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
