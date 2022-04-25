import { Participants } from 'hooks/useParticipants';

import { motion } from 'framer-motion';

export function Participant({ participant }: { participant: string }) {
  return (
    <motion.h1
      transition={{
        type: 'spring',
        stiffness: 250,
        damping: 20,
      }}
      className='text-3xl font-bold text-gray-800 mr-10'
      layout
    >
      {participant}
    </motion.h1>
  );
}
