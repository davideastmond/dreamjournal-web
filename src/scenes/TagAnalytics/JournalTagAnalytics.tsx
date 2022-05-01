import { Box, Dialog, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import {
  getAllTagsCountByUserId,
  getTagCountByJournalId,
} from "../../services/journal/journal.analytics.service";
import { TJournal } from "../../services/journal/journal.types";
import "./style.css";
import { JournalTagTable } from "./JournalTagTable";
interface IJournalTagAnalyticsProps {
  context?: "journalSpecific" | "allJournals";
  journalContext?: TJournal;
  userId: string;
  open: boolean;
  onClickClose?: () => void;
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function JournalTagAnalytics(props: IJournalTagAnalyticsProps) {
  const [value, setValue] = useState<number>(
    props.context === "journalSpecific" ? 0 : 1
  );
  const [tagCount, setTagCount] = useState<{ [keyof: string]: number }>({});
  const [journalCount, setJournalCount] = useState<number>(0);
  const handleClose = () => {
    props.onClickClose && props.onClickClose();
  };

  const handleTabChange = async (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const setTagData = async () => {
    if (value === 0) {
      if (props.journalContext) {
        const data = await getTagCountByJournalId({
          journalId: props.journalContext._id,
        });
        setTagCount(data.tagCount);
      }
    } else {
      const data = await getAllTagsCountByUserId({ userId: props.userId });
      setTagCount(data.tagCount);
      setJournalCount(data.journalCount);
    }
  };
  useEffect(() => {
    setTagData();
  }, []);
  useEffect(() => {
    setTagData();
  }, [value]);
  return (
    <div className="JournalTagsAnalytics__main">
      <Dialog fullScreen open={props.open} TransitionComponent={Transition}>
        <header>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </header>
        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            {props.context === "journalSpecific" && (
              <Tab label="This Journal" {...a11yProps(0)} />
            )}

            <Tab label="All Journals" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <Box>
          {props.context === "journalSpecific" && (
            <TabPanel value={value} index={0}>
              <JournalTagTable data={tagCount} />
            </TabPanel>
          )}
          <TabPanel value={value} index={1}>
            <JournalTagTable data={tagCount} />
          </TabPanel>
        </Box>
      </Dialog>
    </div>
  );
}

export default JournalTagAnalytics;
