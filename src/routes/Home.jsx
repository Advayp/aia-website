import { Divider, Grid, GridItem, Heading, Spinner } from '@chakra-ui/react';
import { collection, deleteDoc, doc, query, where } from 'firebase/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Navbar } from '../components/Navbar';
import ProposalNotification from '../components/ProposalNotification';
import { auth, db } from '../firebase-config';
import { getKeyByValue, SUBJECT_SHORTHAND } from '../utils';

export default function Home() {
  const proposalRef = collection(db, 'proposals');

  const [user] = useAuthState(auth);

  let q;
  if (user) {
    q = query(proposalRef, where('uid', '==', user.uid));
  }

  const [proposals] = useCollectionData(q);

  const remove = async id => {
    const proposal = doc(db, 'proposals', id);
    await deleteDoc(proposal);
  };

  return (
    <>
      <Navbar />
      <Grid templateColumns={'repeat(5, 1fr)'} h="93vh">
        <GridItem colSpan={4} bg="beige">
          Main Content
        </GridItem>
        <GridItem overflow={'auto'} zIndex={'banner'}>
          <Heading size="sm" p={3}>
            My Proposals
          </Heading>
          <Divider />
          {proposals ? (
            proposals.map((v, idx) => {
              return (
                <ProposalNotification
                  className={getKeyByValue(SUBJECT_SHORTHAND, v.className)}
                  title={v.topic}
                  status={v.status}
                  onClose={() => {
                    remove(v.id);
                  }}
                  key={idx}
                />
              );
            })
          ) : (
            <Spinner color="tomato" />
          )}
        </GridItem>
      </Grid>
    </>
  );
}
