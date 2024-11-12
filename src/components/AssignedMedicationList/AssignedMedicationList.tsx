import {PillboxContext} from '../../context/PillboxContext.tsx';
import {useContext} from 'react';
import {PBCellState} from '../../entities/PBCell.entity.ts';
import {FlatList, Text, View} from 'react-native';
import {styles} from './AssignedMedicationListStyles.ts';
import {useLanguage} from '../../context/LanguageContext.tsx';
import {Medication, MedicationTimeType} from '../../entities/Medication.entity.ts';
import {CellColors} from '../PillboxPreview/PillboxPreview.tsx';
import {format} from 'date-fns';
import {MedicationContext} from '../../context/MedicationContext.tsx';
import {translate} from '../../helpers/translate.ts';
import {translations} from '../../translations.ts';

interface MedicationItemProps {
  medicationName: string;
  scheduledTime: Date;
  status: PBCellState;
}

const MedicationItem: React.FC<MedicationItemProps> = ({ medicationName, scheduledTime, status}) => {
  // Format the scheduled time to "DD MMM, HH:mm" in local time
  const formattedTime = format(new Date(scheduledTime), 'dd MMM, HH:mm');
  const { language } = useLanguage();

  return (
    <View style={styles.rowContainer}>
      {/* Status Indicator */}
      <View
        style={[
          styles.statusIndicator,
          { backgroundColor: CellColors[status] },
        ]}
      />

      {/* Medication Details */}
      <View style={styles.medicationDetails}>
        {/* Status Text */}
        <Text style={[styles.statusText, { color: CellColors[status] }]}>
          {translations[language][status]}
        </Text>

        {/* Medication Name */}
        <Text style={styles.medicationName}>{medicationName}</Text>
      </View>

      {/* Scheduled Time */}
      <Text style={styles.scheduledTime}>{formattedTime}</Text>
    </View>
  );
};

export const AssignedMedicationList: React.FC = () => {
  const {pillbox} = useContext(PillboxContext);
  const {medications} = useContext(MedicationContext);
  const {translations} = useLanguage();

  const usedCells = pillbox?.cells.filter(cell => cell.state !== PBCellState.NotUsed) ?? [];

  if (usedCells.length === 0) {
    return(
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{translations.noAsssignedMedications}</Text>
      </View>
    );
  }

  const medicationData = usedCells.map((cell, index) => {
    const medication = medications.find(med => med.id === cell.medicationId);
    if (!medication) {
      return null;
    }
    //first time after now for medication timeType === MedicationTimeType.ByTime, first time with current date after now for MedicationTimeType.EveryNDays
    const scheduledTime = medication.times.find(time => {
      if (medication.timeType === MedicationTimeType.ByTime) {
        return new Date(time) > new Date();
      } else if (medication.timeType === MedicationTimeType.EveryNDays) {
        return new Date(time) > new Date(new Date().toDateString());
      }
    }) ?? medication.times[index % medication.times.length];

    const status = cell.state;
    const medicationName = medication.name;

    return {
      medicationName,
      scheduledTime,
      status,
      label: cell.label,
    };
  }).filter(Boolean).splice(-2); // todo: remove splice, fix scroll

  return (
    <FlatList data={medicationData} renderItem={(item) => <MedicationItem {...item.item} />} keyExtractor={(item) => item.label} />
  );
};
