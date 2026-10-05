import LegalPage from '../legal-page';

export const metadata = {
  title: 'Согласие на обработку персональных данных | IROX',
};

export default function Page() {
  return <LegalPage lang="ru" doc="consent"/>;
}
