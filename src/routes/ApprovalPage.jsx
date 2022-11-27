import { Flex, useToast, Text } from '@chakra-ui/react';
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Navbar } from '../components/Navbar';
import { auth, db } from '../firebase-config';
import CenteredSpinner from '../components/CenteredSpinner';
import { useNavigate } from 'react-router-dom';
import PendingProposal from '../components/PendingProposal';

export default function ApprovalPage() {
  const organizerTableRef = collection(db, 'organizers');
  const proposalTableRef = collection(db, 'proposals');

  const [user] = useAuthState(auth);
  const [proposals, setProposals] = useState([]);
  const navigate = useNavigate();

  const toast = useToast();

  let organizerQuery, proposalsQuery;
  if (user) {
    organizerQuery = query(organizerTableRef, where('uid', '==', user.uid));
    proposalsQuery = query(proposalTableRef, where('status', '==', 'none'));
  }
  const [organizerInfo] = useCollectionData(organizerQuery, {
    idField: 'id',
  });

  const [proposalInfo] = useCollectionData(proposalsQuery, {
    idField: 'id',
  });

  useEffect(() => {
    if (organizerInfo) {
      if (!organizerInfo[0].isOrganizer) {
        navigate('/');
      }
    }
  }, [organizerInfo]);

  useEffect(() => {
    const fetchProposals = async () => {
      const data = await getDocs(proposalsQuery);
      setProposals(data.docs.map(f => ({ ...f.data(), id: f.id })));
    };
    fetchProposals();
    // having this as a dependency helps for some reason
  }, [proposalInfo]);

  const approve = async (docId, ob) => {
    setProposals(proposals.filter(x => x !== ob));
    toast({
      title: 'Approved!',
      duration: 3000,
      status: 'success',
      position: 'bottom-left',
      description: `Approved topic \`${ob.topic}\``,
    });
    const proposal = doc(db, 'proposals', docId);
    const newData = ob;
    newData.status = 'approved';
    await updateDoc(proposal, newData);
  };

  const reject = async (docId, ob) => {
    setProposals(proposals.filter(x => x !== ob));
    toast({
      title: 'Rejected',
      duration: 3000,
      status: 'error',
      position: 'bottom-left',
      description: `Rejected topic \`${ob.topic}\``,
    });
    const proposal = doc(db, 'proposals', docId);
    const newData = ob;
    newData.status = 'rejected';
    await updateDoc(proposal, newData);
  };

  return (
    <>
      <Navbar />
      {organizerInfo ? (
        <Flex flexDir={'column'} w="100%" align={'center'}>
          {proposals.length !== 0 ? (
            proposals.map((v, idx) => {
              return (
                <>
                  <PendingProposal
                    proposal={v}
                    key={idx}
                    approve={approve}
                    reject={reject}
                  />
                </>
              );
            })
          ) : (
            <Flex w="100%" justify={'center'} mt={2}>
              <Text fontSize={'2xl'} fontWeight="hairline">
                No Pending Proposals
              </Text>
            </Flex>
          )}
        </Flex>
      ) : (
        <CenteredSpinner />
      )}
    </>
  );
}
