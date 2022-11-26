import {
  Button,
  Divider,
  Grid,
  GridItem,
  Heading,
  Flex,
} from '@chakra-ui/react';
import {
  collection,
  deleteDoc,
  doc,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import CenteredSpinner from '../components/CenteredSpinner';
import { Navbar } from '../components/Navbar';
import ProposalNotification from '../components/ProposalNotification';
import { auth, db } from '../firebase-config';
import { getKeyByValue, SUBJECT_SHORTHAND } from '../utils';
import { Dashboard } from '../components/Dashboard';
import { Link as RouterLink } from 'react-router-dom';

export default function Home() {
  const proposalRef = collection(db, 'proposals');

  const [user] = useAuthState(auth);

  let q;
  if (user) {
    q = query(
      proposalRef,
      where('uid', '==', user.uid),
      where('viewed', '==', false)
    );
  }

  const [proposals] = useCollectionData(q);

  const remove = async (id, ob) => {
    const proposal = doc(db, 'proposals', id);
    const newData = ob;
    ob.viewed = true;
    await updateDoc(proposal, newData);
  };

  return (
    <>
      <Navbar />
      <Grid templateColumns={'repeat(5, 1fr)'} h="93vh">
        <GridItem colSpan={4}>
          <Dashboard />
        </GridItem>
        <GridItem
          overflow={'auto'}
          zIndex={'banner'}
          borderLeft="1px"
          borderColor={'gray.200'}
        >
          <Heading size="sm" p={3}>
            My Proposals
          </Heading>
          <Divider />
          {proposals ? (
            proposals.length !== 0 ? (
              proposals.map((v, idx) => {
                return (
                  <ProposalNotification
                    className={getKeyByValue(SUBJECT_SHORTHAND, v.className)}
                    title={v.topic}
                    status={v.status}
                    onClose={() => {
                      remove(v.id, v);
                    }}
                    key={idx}
                  />
                );
              })
            ) : (
              <RouterLink to="/notes/propose">
                <Flex>
                  <Button w="80%" mx={'auto'} mt={2} colorScheme={'messenger'}>
                    New Proposal
                  </Button>
                </Flex>
              </RouterLink>
            )
          ) : (
            <CenteredSpinner />
          )}
        </GridItem>
      </Grid>
    </>
  );
}
