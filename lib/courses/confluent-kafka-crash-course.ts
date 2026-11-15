import type { Series } from '@/lib/learning';

// The Confluent Kafka crash course (FS-0012): one episode per module of the public repo, plus an intro.
// The episodes give the reasoning and the lab follows each one step by step; the scripts are in the
// wiki (publishing/confluent-crash-course/episodes/). Episode n is module 0n in the repo.
export const confluentKafkaCrashCourse: Series = {
  slug: 'confluent-kafka-crash-course',
  title: 'Confluent Kafka crash course',
  line: 'Apache Kafka with Confluent Platform in your own data centres and Confluent Cloud on Azure: linking, private networking, governance, encryption and access, with a lab for every module.',
  level: 'Advanced',
  repo: 'https://github.com/fps4/confluent-kafka-crash-course',
  episodes: [
    {
      number: '0',
      slug: 'why-this-course',
      title: 'Why this course',
      line: 'Kafka in your own data centres, data teams in Azure: the situation the course is built around, who it is for, and how a module works.',
      video: {
        youtubeId: 'ci4eOUho0mM',
        duration: '3:07',
        poster: '/media/learning/confluent-0.jpg',
        uploaded: '2026-11-13',
      },
      repoLinks: [{ label: 'Set up the labs', path: '00-lab-setup/README.md' }],
      promise: [
        'The situation: a mobile operator’s Kafka in two data centres, and data and AI teams in Azure who want the same events.',
        'Who the course is for: experienced engineers who already run Kafka. It is an advanced course.',
        'How a module works: a video with the reasoning, and a lab that follows it step by step.',
      ],
    },
    {
      number: '1',
      slug: 'getting-data-out',
      title: 'Getting data out of the data centre',
      line: 'One outbound Kafka cluster link to Confluent Cloud, schemas that keep their IDs, and what broker-side validation checks.',
      repoModule: '01-linking-and-contracts',
      repoLinks: [{ label: 'Notes: data contracts', path: '01-linking-and-contracts/notes-data-contracts.md' }],
      promise: [
        'How one outbound connection carries a full copy of a topic to Confluent Cloud.',
        'Why that copy is useless if the schemas don’t travel with it.',
        'What broker-side schema validation checks, which is less than most people think.',
      ],
      questions: [
        'Which cloud cluster type is the destination, and how does the data centre reach it?',
        'Does the on-prem licence include Confluent Server and Cluster Linking?',
        'Which topics are on the allow-list, and who approves a new one?',
        'Which registry is the write master for each subject?',
        'What is the firewall idle timeout on the outbound flow?',
      ],
    },
    {
      number: '2',
      slug: 'copies-and-failover',
      title: 'Copies, failover and the way back',
      line: 'Kafka byte copies and record copies, what an analytics copy promises, and why failback is decided on day one.',
      repoModule: '02-hybrid-multicloud',
      promise: [
        'How the three tools for copying Kafka data differ, and how to pick one.',
        'Why a copy for analytics and a copy for disaster recovery make different promises.',
        'Why the way back has to be decided on the day you build the link.',
      ],
      questions: [
        'What is the round-trip time between the data centres, and is there a third site?',
        'Which topics may leave the data centre, and who decides?',
        'Do the on-prem brokers run Confluent Server, or plain Apache Kafka?',
        'Is the cloud copy only for analytics, or could it ever become a recovery site?',
      ],
    },
    {
      number: '3',
      slug: 'kafka-on-azure-networks',
      title: 'Kafka doesn’t fit through a load balancer',
      line: 'Why Kafka networking is different, Private Link on Azure, and the DNS that makes it work.',
      repoModule: '03-cloud-networking-azure',
      promise: [
        'Why a Kafka client must reach every broker, so a load balancer or an API gateway can’t sit in the path.',
        'Which private networking options you have on Azure, and which one fits a data centre.',
        'How DNS has to work, from the cloud and from the data centre.',
      ],
      questions: [
        'Is there already a hub with an ExpressRoute gateway, a firewall and a DNS resolver?',
        'How do on-prem DNS servers resolve Azure private endpoints today?',
        'What idle timeout do the firewalls apply to long-lived connections?',
        'Are production and non-production separate Confluent environments?',
      ],
    },
    {
      number: '4',
      slug: 'stream-governance',
      title: 'Governance for teams that don’t know each other',
      line: 'Kafka governance: no schema, no topic; Git as the source of truth; a catalog the cloud teams use.',
      repoModule: '04-stream-governance',
    },
    {
      number: '5',
      slug: 'field-level-encryption',
      title: 'Encrypting a field nobody else should read',
      line: 'Field-level encryption for Kafka: minimise first, then encrypt; who holds the key, and what Databricks sees.',
      repoModule: '05-csfle',
    },
    {
      number: '6',
      slug: 'security-and-access',
      title: 'Who is allowed to read this',
      line: 'Kafka access with Entra ID in place of shared API keys, one role per access pattern, quotas and audit.',
      repoModule: '06-cloud-security',
      repoLinks: [{ label: 'Notes: the Confluent Platform side', path: '06-cloud-security/notes-cp-security.md' }],
    },
    {
      number: '7',
      slug: 'production-platform',
      title: 'From “it works” to “it runs a business”',
      line: 'Kafka as the accidental shared service, clusters split by SLA, lag in seconds, and chargeback.',
      repoModule: '07-production-systems',
    },
    {
      number: '8',
      slug: 'kafka-internals',
      title: 'One layer down',
      line: 'The Kafka internals behind these decisions: acks, in-sync replicas, and the third site.',
      repoModule: '08-kafka-internals',
      repoLinks: [{ label: 'Notes: clients and storage', path: '08-kafka-internals/notes-clients-and-storage.md' }],
    },
  ],
};
