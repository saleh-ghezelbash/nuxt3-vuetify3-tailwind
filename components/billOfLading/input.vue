<template>
  <v-form v-if="showForm" ref="form" :disabled="loading === 'submit'">
    <v-btn
      v-bind="attrs"
      fab
      top
      class="transparent"
      elevation="0"
      v-on="on"
      @click="back"
    >
      <v-icon>mdi-arrow-right</v-icon>
    </v-btn>

    <v-row v-if="rowNumber">
      <v-col cols="3">
        <v-card class="tw-m-1">
          <v-card-title>
            <div class="tw-font-bold tw-mr-2">
              شماره ردیف: <span class="tw-text-lg">{{ rowNumber }}</span>
            </div>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="tw-m-1">
      <v-card-title class="primary tw-text-white pa-3">
        اطلاعات پالایشگاه مبدأ
      </v-card-title>
      <v-card-text>
        <v-skeleton-loader v-if="loading === 'get'" type="article" />
        <v-row v-else class="mt-5" dense>
          <v-col cols="2">
            <v-autocomplete
              v-model="inputData.product"
              label="محصول *"
              outlined
              :items="resources.products"
              item-text="title"
              item-value="id"
              return-object
              tabindex="1"
              :rules="[hasValue(inputData.product, 'محصول')]"
              @change="inputData.origin = ''"
            />
          </v-col>
          <v-col cols="2">
            <v-row v-if="!refreshRemittanceNumber" dense>
              <v-col
                v-for="(rn, i) in inputData.remittanceNumber"
                :key="i"
                cols="12"
              >
                <v-text-field
                  v-model="inputData.remittanceNumber[i]"
                  label="شماره حواله"
                  tabindex="2"
                  outlined
                  :prepend-inner-icon="
                    inputData.remittanceNumber.length > 1
                      ? 'mdi-minus-circle-outline'
                      : null
                  "
                  :append-icon="
                    i + 1 === inputData.remittanceNumber.length &&
                    inputData.remittanceNumber.length < 3
                      ? 'mdi-plus-circle-outline'
                      : null
                  "
                  @click:append="addRemittanceNumber(i)"
                  @click:prepend-inner="removeRemittanceNumber(i)"
                  @keydown="contractRemainings[i] = ''"
                  @blur="getContractRemaining(i)"
                />
                <div
                  v-if="contractRemainings[i] > 0"
                  :class="
                    contractRemainings.length === 1 ? 'mt-n7' : '-tw-mt-6'
                  "
                >
                  <template v-if="!id">
                    مانده قرارداد:
                    {{ contractRemainings[i] - inputData.refineryNetWeight[i] }}
                  </template>
                  <template v-else>
                    مانده قرارداد:
                    {{ contractRemainings[i] + inputData.refineryNetWeight[i] }}
                  </template>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2">
            <v-row dense>
              <v-col
                v-for="(rn, i) in inputData.remittanceNumber"
                :key="i"
                cols="12"
              >
                <v-text-field
                  v-model="inputData.exchangeContractNumber[i]"
                  label="شماره قرارداد بورس"
                  tabindex="3"
                  outlined
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2">
            <v-autocomplete
              v-model="inputData.buyer"
              label="خریدار *"
              outlined
              :items="resources.buyers"
              item-text="title"
              item-value="id"
              tabindex="4"
              :rules="[hasValue(inputData.buyer, 'خریدار')]"
            />
          </v-col>
          <v-col cols="2">
            <v-autocomplete
              v-model="inputData.origin"
              label="مبدأ *"
              outlined
              :items="refineries"
              item-text="title"
              item-value="id"
              tabindex="5"
              :rules="[hasValue(inputData.origin, 'مبدأ')]"
              @change="inputData.originTank = ''"
            />
          </v-col>
          <v-col cols="2">
            <v-autocomplete
              v-model="inputData.originTank"
              :disabled="originTanks.length === 0"
              :items="originTanks"
              label="مخزن مبدأ"
              outlined
              item-text="title"
              item-value="id"
              tabindex="5"
            />
          </v-col>
          <v-col cols="2">
            <number-plate
              v-model="plaque"
              :required="true"
              @change="getTankerNumber"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.tankerNumber"
              label="شماره تانکر"
              outlined
              tabindex="10"
            />
          </v-col>
          <v-col cols="2">
            <v-autocomplete
              ref="driver"
              v-model="inputData.driver"
              label="راننده *"
              outlined
              :items="drivers"
              :loading="driversLoading"
              tabindex="11"
              :append-outer-icon="driverOuterIcon()"
              :rules="[hasValue(inputData.driver, 'راننده')]"
              @click:append-outer="
                inputData.driver ? changeDriverName() : addDriver()
              "
            />
          </v-col>
          <v-col cols="2">
            <v-autocomplete
              v-model="inputData.transportContractor"
              label="پیمانکار حمل *"
              outlined
              :items="resources.transportContractors"
              item-text="company"
              item-value="id"
              tabindex="12"
              :rules="[hasValue(inputData.transportContractor, 'پیمانکار حمل')]"
            />
          </v-col>
          <v-col cols="2">
            <inputDate
              v-model="inputData.refineryEnteringDate"
              :label="'تاریخ ورود به پالایشگاه'"
              :rules="[
                dateCheck(
                  inputData.refineryEnteringDate,
                  inputData.refineryEnteringDate,
                  inputData.refineryLeavingDate,
                ),
              ]"
              :tab-index="13"
              @input="(e) => (inputData.refineryEnteringDate = e)"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.refineryEnteringTime"
              v-mask="timeRangeMask"
              label="ساعت ورود به پالایشگاه *"
              outlined
              :rules="[
                isTime(inputData.refineryEnteringTime),
                hasValue(
                  inputData.refineryEnteringTime,
                  'ساعت ورود به پالایشگاه',
                ),
                timeCheck(
                  inputData.refineryEnteringDate +
                    inputData.refineryEnteringTime,
                  inputData.refineryEnteringDate +
                    inputData.refineryEnteringTime,
                  inputData.refineryLeavingDate + inputData.refineryLeavingTime,
                ),
              ]"
              tabindex="13"
            />
          </v-col>
          <v-col cols="2">
            <inputDate
              v-model="inputData.refineryLeavingDate"
              label="تاریخ خروج از پالایشگاه"
              :rules="[
                dateCheck(
                  inputData.refineryLeavingDate,
                  inputData.refineryEnteringDate,
                  inputData.securityAppointmentDate,
                ),
              ]"
              :tab-index="13"
              @input="(e) => (inputData.refineryLeavingDate = e)"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.refineryLeavingTime"
              v-mask="timeRangeMask"
              label="ساعت خروج از پالایشگاه *"
              outlined
              :rules="[
                isTime(inputData.refineryLeavingTime),
                hasValue(
                  inputData.refineryLeavingTime,
                  'ساعت خروج از پالایشگاه',
                ),
                timeCheck(
                  inputData.refineryLeavingDate + inputData.refineryLeavingTime,
                  inputData.refineryEnteringDate +
                    inputData.refineryEnteringTime,
                  inputData.securityAppointmentDate +
                    inputData.securityAppointmentTime,
                ),
              ]"
              tabindex="14"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              :value="originSleep"
              label="خواب مبدأ"
              :rules="[sleepCheck]"
              outlined
              readonly
              tabindex="14"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.refineryFullWeight"
              label="وزن پر پالایشگاه"
              outlined
              type="number"
              min="0"
              tabindex="15"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.refineryEmptyWeight"
              label="وزن خالی پالایشگاه"
              outlined
              type="number"
              min="0"
              tabindex="15"
            />
          </v-col>
          <v-col cols="2">
            <v-row dense>
              <v-col
                v-for="(rn, i) in inputData.remittanceNumber"
                :key="i"
                cols="12"
              >
                <v-text-field
                  v-model.number="inputData.refineryNetWeight[i]"
                  label="وزن خالص پالایشگاه / گمرک"
                  outlined
                  type="number"
                  min="0"
                  tabindex="16"
                  :rules="[
                    hasValue(
                      inputData.refineryNetWeight[i],
                      'وزن خالص پالایشگاه / گمرک',
                    ),
                    checkMoreThan(
                      inputData.refineryNetWeight[i],
                      'وزن خالص پالایشگاه / گمرک',
                      38000,
                    ),
                  ]"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.mehvar_petro"
              label="محور / پترو آموت"
              outlined
              type="number"
              tabindex="17"
            />
          </v-col>
          <v-col cols="2">
            <v-row dense>
              <v-col
                v-for="(rn, i) in inputData.remittanceNumber"
                :key="i"
                cols="12"
              >
                <v-text-field
                  v-model="inputData.valueInLiters[i]"
                  label="مقدار به لیتر"
                  outlined
                  type="number"
                  min="0"
                  tabindex="18"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.sixtyDegreeValue"
              label="مقدار 60 درجه"
              type="number"
              outlined
              tabindex="19"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.specialWeight"
              label="وزن مخصوص"
              type="number"
              min="0"
              outlined
              tabindex="20"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="my-4">
      <v-card-title class="primary tw-text-white pa-3">
        اطلاعات بارنامه پلیس راهی
      </v-card-title>
      <v-card-text>
        <v-skeleton-loader v-if="loading === 'get'" type="article" />
        <v-row v-else class="mt-5" dense>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.billOfLadingNumber"
              label="شماره بارنامه"
              outlined
              type="number"
              min="0"
              tabindex="21"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.policeBillOfLadingFare"
              label="کرایه بارنامه پلیس راهی"
              outlined
              tabindex="22"
              @input="separateNumbers"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title class="primary tw-text-white pa-3">
        اطلاعات واحد حراست
      </v-card-title>
      <v-card-text>
        <v-skeleton-loader v-if="loading === 'get'" type="article" />
        <v-row v-else class="mt-5" dense>
          <v-col cols="2">
            <inputDate
              v-model="inputData.securityAppointmentDate"
              label="تاریخ نوبت دهی حراست"
              :rules="[
                dateCheck(
                  inputData.securityAppointmentDate,
                  inputData.refineryLeavingDate,
                  inputData.weighbridgeEnteringDate,
                ),
              ]"
              :tab-index="23"
              @input="(e) => (inputData.securityAppointmentDate = e)"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.securityAppointmentTime"
              v-mask="timeRangeMask"
              label="ساعت نوبت دهی حراست *"
              outlined
              :rules="[
                isTime(inputData.securityAppointmentTime),
                hasValue(
                  inputData.securityAppointmentTime,
                  'ساعت نوبت دهی حراست',
                ),
                timeCheck(
                  inputData.securityAppointmentDate +
                    inputData.securityAppointmentTime,
                  inputData.refineryLeavingDate + inputData.refineryLeavingTime,
                  inputData.weighbridgeEnteringDate +
                    inputData.weighbridgeEnteringTime,
                ),
              ]"
              tabindex="23"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="tankerSleepDuringRoad"
              label="خواب بین مسیر تانکر"
              outlined
              readonly
              :rules="[sleepCheck]"
              tabindex="23"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.laboratoryAnnouncementTime"
              v-mask="timeRangeMask"
              label="ساعت اعلام به آزمایشگاه"
              outlined
              :rules="[isTime(inputData.laboratoryAnnouncementTime)]"
              tabindex="23"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.samplingTime"
              v-mask="timeRangeMask"
              label="ساعت نمونه گیری"
              outlined
              :rules="[isTime(inputData.samplingTime)]"
              tabindex="24"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.laboratoryAnsewrAnnouncementTime"
              v-mask="timeRangeMask"
              label="ساعت اعلام جواب آزمایشگاه"
              outlined
              :rules="[isTime(inputData.laboratoryAnsewrAnnouncementTime)]"
              tabindex="25"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mt-4">
      <v-card-title class="primary tw-text-white pa-3">
        اطلاعات قبض باسکول پالایش نفت آفتاب
      </v-card-title>
      <v-card-text>
        <v-skeleton-loader v-if="loading === 'get'" type="article" />
        <v-row v-else class="mt-5" dense>
          <v-col cols="2">
            <inputDate
              v-model="inputData.weighbridgeEnteringDate"
              label="تاریخ ورود به باسکول"
              :tab-index="34"
              :rules="[
                dateCheck(
                  inputData.weighbridgeEnteringDate,
                  inputData.securityAppointmentDate,
                  inputData.weighbridgeLeavingDate,
                ),
              ]"
              @input="(e) => (inputData.weighbridgeEnteringDate = e)"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.weighbridgeEnteringTime"
              v-mask="timeRangeMask"
              label="ساعت ورود به باسکول"
              outlined
              :rules="[
                isTime(inputData.weighbridgeEnteringTime),
                timeCheck(
                  inputData.weighbridgeEnteringDate +
                    inputData.weighbridgeEnteringTime,
                  inputData.securityAppointmentDate +
                    inputData.securityAppointmentTime,
                  inputData.weighbridgeLeavingDate +
                    inputData.weighbridgeLeavingTime,
                ),
              ]"
              tabindex="35"
            />
          </v-col>
          <v-col cols="2">
            <inputDate
              v-model="inputData.weighbridgeLeavingDate"
              label="تاریخ خروج از باسکول"
              :tab-index="36"
              :required="true"
              @input="(e) => (inputData.weighbridgeLeavingDate = e)"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.weighbridgeLeavingTime"
              v-mask="timeRangeMask"
              label="ساعت خروج از باسکول *"
              outlined
              :rules="[
                isTime(inputData.weighbridgeLeavingTime),
                hasValue(
                  inputData.weighbridgeLeavingTime,
                  'ساعت خروج از باسکول',
                ),
                timeCheck(
                  inputData.weighbridgeLeavingDate +
                    inputData.weighbridgeLeavingTime,
                  inputData.weighbridgeEnteringDate +
                    inputData.weighbridgeEnteringTime,
                  inputData.weighbridgeLeavingDate +
                    inputData.weighbridgeLeavingTime,
                ),
              ]"
              tabindex="37"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.factoryFullWeight"
              label="وزن پر کارخانه"
              outlined
              type="number"
              min="0"
              tabindex="40"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="inputData.factoryEmptyWeight"
              label="وزن خالی کارخانه"
              outlined
              type="number"
              min="0"
              tabindex="41"
            />
          </v-col>
          <v-col cols="2">
            <v-row dense>
              <v-col
                v-for="(rn, i) in inputData.remittanceNumber"
                :key="i"
                cols="12"
              >
                <v-text-field
                  v-model.lazy.number="inputData.factoryNetWeight[i]"
                  label="وزن خالص کارخانه"
                  outlined
                  :readonly="inputData.remittanceNumber.length === 1"
                  type="number"
                  tabindex="42"
                  :rules="[
                    checkMoreThan(
                      inputData.factoryNetWeight[i],
                      'وزن خالص کارخانه',
                      38000,
                    ),
                  ]"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2">
            <v-row dense>
              <v-col
                v-for="(rn, i) in inputData.remittanceNumber"
                :key="i"
                cols="12"
              >
                <v-autocomplete
                  v-model="inputData.loadDestination[i]"
                  label="مقصد بار *"
                  outlined
                  :items="resources.destinations"
                  item-text="title"
                  item-value="id"
                  :return-object="i === 0"
                  tabindex="44"
                  :rules="[hasValue(inputData.loadDestination[i], 'مقصد بار')]"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2">
            <v-autocomplete
              v-model="inputData.drainTankName"
              label="نام مخزن تخلیه"
              outlined
              :items="resourcesDrainTanks"
              item-text="title"
              item-value="id"
              tabindex="33"
            />
          </v-col>
          <v-col cols="2">
            <v-row dense>
              <v-col
                v-for="(rn, i) in inputData.remittanceNumber"
                :key="i"
                cols="12"
              >
                <v-autocomplete
                  v-model="inputData.sendStatus[i]"
                  label="وضعیت ارسال"
                  outlined
                  :items="resources.sendStatuses"
                  item-text="title"
                  item-value="id"
                  tabindex="44"
                  clearable
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2">
            <v-row dense>
              <v-col
                v-for="(rn, i) in inputData.remittanceNumber"
                :key="i"
                cols="12"
              >
                <v-autocomplete
                  v-model="inputData.dischargeStatus[i]"
                  label="وضعیت *"
                  outlined
                  :items="dischargeStatusList"
                  tabindex="45"
                  :rules="[hasValue(inputData.dischargeStatus[i], 'وضعیت')]"
                  @change="removeValue(i)"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2">
            <v-row dense>
              <template v-for="(rn, i) in inputData.remittanceNumber">
                <v-col
                  v-if="inputData.dischargeStatus[i] === 'E'"
                  :key="i"
                  cols="12"
                >
                  <v-text-field
                    v-model="inputData.outboundBillOfLadingNumber[i]"
                    label="شماره بارنامه خروجی"
                    outlined
                    tabindex="46"
                    :rules="[
                      duplicateBillOfLadingNumberRule(i),
                      duplicateBillOfLadingNumberApiRule(i),
                    ]"
                    @keydown="billOfLadingNumbers[i] = true"
                    @blur="
                      checkDuplicateBillOfLadingNumber(
                        inputData.outboundBillOfLadingNumber[i],
                        i,
                      )
                    "
                  />
                </v-col>
                <v-col
                  v-else-if="inputData.dischargeStatus[i] === 'T'"
                  :key="rn.id"
                  cols="12"
                >
                  <v-text-field
                    :value="totalSleep"
                    label="خواب کلی"
                    outlined
                    readonly
                    :rules="[sleepCheck]"
                    tabindex="46"
                  />
                </v-col>
              </template>
            </v-row>
          </v-col>
          <template v-if="checkDischargeStatusE">
            <v-col cols="2">
              <input-date
                v-model="inputData.weighbridgeLeavingDate2"
                label="تاریخ خروج از باسکول 2"
                :rules="[
                  isDate(inputData.weighbridgeLeavingDate2),
                  dateCheck(
                    inputData.weighbridgeLeavingDate2,
                    inputData.weighbridgeLeavingDate,
                    inputData.weighbridgeLeavingDate2,
                  ),
                ]"
                tabindex="47"
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="inputData.weighbridgeLeavingTime2"
                v-mask="timeRangeMask"
                label="ساعت خروج از باسکول 2"
                outlined
                :rules="[
                  isTime(inputData.weighbridgeLeavingTime2),
                  beforeCurrentTime(
                    inputData.weighbridgeLeavingDate2 +
                      'T' +
                      inputData.weighbridgeLeavingTime2,
                    currentTime,
                  ),
                  timeCheck(
                    inputData.weighbridgeLeavingDate2 +
                      inputData.weighbridgeLeavingTime2,
                    inputData.weighbridgeLeavingDate +
                      inputData.weighbridgeLeavingTime,
                    inputData.weighbridgeLeavingDate2 +
                      inputData.weighbridgeLeavingTime2,
                  ),
                ]"
                tabindex="48"
              />
            </v-col>
            <v-col cols="3" />
          </template>
          <v-col cols="6">
            <v-textarea
              v-model="inputData.description"
              label="توضیحات"
              outlined
              rows="3"
              no-resize
              tabindex="49"
              clearable
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <template v-if="loading !== 'get'">
      <v-btn
        v-bind="attrs"
        fixed
        fab
        bottom
        left
        color="primary"
        dark
        class="ml-5 mb-5"
        :loading="loading === 'submit'"
        v-on="on"
        @click="save"
      >
        <v-icon>mdi-content-save-outline</v-icon>
      </v-btn>
      <v-btn
        v-bind="attrs"
        fixed
        fab
        bottom
        left
        color="secondary"
        dark
        small
        class="tw-ml-24 mb-6"
        v-on="on"
        @click="restoreData"
      >
        <v-icon>mdi-restore</v-icon>
      </v-btn>
    </template>
    <!-- <changeDriverName
      v-if="changeDriverNameDialog"
      :name="inputData.driver"
      @close="closeChangeDriverNameDialog($event)"
    /> -->
  </v-form>
</template>

<script>
import moment from "moment-jalaali";
import { rules } from "../../mixins/rules";
// import changeDriverName from "./changeDriverName.vue";
import globals from "~/globals/globals";

export default {
  name: "InputComponent",
  //   components: { changeDriverName },
  mixins: [rules],
  layout: "dashboard",
  props: {
    resources: {
      type: Object,
      default: () => {},
    },
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      inputData: {
        product: "",
        remittanceNumber: [""],
        exchangeContractNumber: [""],
        buyer: "",
        origin: "",
        tankerNumber: "",
        driver: null,
        transportContractor: "",
        refineryEnteringDate: "",
        refineryEnteringTime: "",
        refineryLeavingDate: "",
        refineryLeavingTime: "",
        refineryEmptyWeight: "",
        refineryFullWeight: "",
        originTank: "",
        refineryNetWeight0: 0,
        refineryNetWeight1: 0,
        refineryNetWeight: [0],
        mehvar_petro: "",
        valueInLiters: [""],
        sixtyDegreeValue: "",
        specialWeight: "",
        billOfLadingNumber: "",
        policeBillOfLadingFare: "",
        securityAppointmentDate: "",
        securityAppointmentTime: "",
        laboratoryAnnouncementTime: "",
        samplingTime: "",
        laboratoryAnsewrAnnouncementTime: "",
        sleepTimeAnnouncementToLaboratoryUntilDelivery: "",
        laboratoryAnswerSleep: "",
        drainTankName: "",
        weighbridgeEnteringDate: "",
        weighbridgeEnteringTime: "",
        weighbridgeLeavingDate: "",
        weighbridgeLeavingTime: "",
        sleepingTimeFromAnsweringUntilWeighbridgeEntering: "",
        factoryFullWeight: "",
        factoryEmptyWeight: "",
        factoryNetWeight: [0],
        sedimentationAmount: "",
        totalSleep: "",
        sendStatus: [""],
        loadDestination: [""],
        dischargeStatus: [""],
        outboundBillOfLadingNumber: [""],
        weighbridgeLeavingDate2: "",
        weighbridgeLeavingTime2: "",
        description: "",
      },
      rowNumber: null,
      plaque: "",
      firstRefineryNetWeightValue: 0,
      drivers: [],
      dischargeStatusList: [
        { text: "T", value: "T" },
        { text: "E", value: "E" },
      ],
      // sendStatuses: [
      //   {
      //     id: 1,
      //     title: 'ارسال از شهرستان - سایت شمال پالایشگاه - E'
      //   },
      //   {
      //     id: 2,
      //     title: 'ارسال از شهرک صنعتی - سایت شمال پالایشگاه - E'
      //   },
      //   {
      //     id: 3,
      //     title: 'ارسال از شهرک صنعتی'
      //   },
      //   {
      //     id: 4,
      //     title: 'ارسال از شهرستان'
      //   }
      // ],
      contractRemainings: [],
      contractRemaining0: 0,
      contractRemaining1: 0,
      loading: "",
      driversLoading: true,
      splitData: false,
      showForm: true,
      dataSaved: false,
      currentTime: "",
      changeDriverNameDialog: false,
      userData: {},
      billOfLadingNumbers: [true],
      // newRemittanceNumbers: [],
      deletedRemittanceNumbers: [],
      // tempRemittanceNumbers: [],
      refreshRemittanceNumber: false,
    };
  },
  head() {
    return {
      title: "ورودی",
    };
  },
  computed: {
    refineries() {
      const REFINERIES = [];
      const PRODUCT_REFINERIES = this.inputData.product?.id
        ? JSON.parse(this.inputData.product.refineries)
        : [];
      PRODUCT_REFINERIES.forEach((refinery) => {
        REFINERIES.push(
          this.resources.origins.find((origin) => {
            return origin.id === refinery;
          }),
        );
      });
      return REFINERIES;
    },
    originTanks() {
      if (this.inputData.origin) {
        return this.resources.originTanks.filter(
          (originTank) => originTank.location === this.inputData.origin,
        );
      }
      return [];
    },
    originSleep() {
      const ENTERING =
        this.inputData.refineryEnteringDate +
        "T" +
        this.inputData.refineryEnteringTime +
        ":00";
      const LEAVING =
        this.inputData.refineryLeavingDate +
        "T" +
        this.inputData.refineryLeavingTime +
        ":00";
      const RES = globals.timeDifference(LEAVING, ENTERING);
      if (RES !== "NaN:NaN") {
        return RES;
      }
      return null;
    },
    sleepDuration() {
      const ENTERING =
        this.inputData.weighbridgeEnteringDate +
        "T" +
        this.inputData.weighbridgeEnteringTime +
        ":00";
      const LEAVING =
        this.inputData.weighbridgeLeavingDate +
        "T" +
        this.inputData.weighbridgeLeavingTime +
        ":00";
      const RES = globals.timeDifference(LEAVING, ENTERING);
      if (RES !== "NaN:NaN") {
        return RES;
      }
      return null;
    },
    totalSleep() {
      const ENTERING =
        this.inputData.securityAppointmentDate +
        "T" +
        this.inputData.securityAppointmentTime +
        ":00";
      const LEAVING =
        this.inputData.weighbridgeLeavingDate +
        "T" +
        this.inputData.weighbridgeLeavingTime +
        ":00";
      const RES = globals.timeDifference(LEAVING, ENTERING);
      if (RES !== "NaN:NaN") {
        return RES;
      }
      return null;
    },
    // خواب بین مسیر
    tankerSleepDuringRoad() {
      const START =
        this.inputData.refineryLeavingDate +
        "T" +
        this.inputData.refineryLeavingTime +
        ":00";
      const END =
        this.inputData.securityAppointmentDate +
        "T" +
        this.inputData.securityAppointmentTime +
        ":00";
      const RES = globals.timeDifference(END, START);
      if (RES !== "NaN:NaN") {
        return RES;
      }
      return null;
    },
    sleepTimeAnnouncementToLaboratoryUntilDelivery() {
      const START =
        this.inputData.securityAppointmentDate +
        "T" +
        this.inputData.laboratoryAnnouncementTime +
        ":00";
      const END =
        this.inputData.securityAppointmentDate +
        "T" +
        this.inputData.laboratoryAnsewrAnnouncementTime +
        ":00";
      const RES = globals.timeDifference(END, START);
      if (RES !== "NaN:NaN") {
        return RES;
      }
      return null;
    },
    sleepingTimeFromAnsweringUntilWeighbridgeEntering() {
      const START =
        this.inputData.securityAppointmentDate +
        "T" +
        this.inputData.laboratoryAnsewrAnnouncementTime +
        ":00";
      const END =
        this.inputData.weighbridgeEnteringDate +
        "T" +
        this.inputData.weighbridgeEnteringTime +
        ":00";
      const RES = globals.timeDifference(END, START);
      if (RES !== "NaN:NaN") {
        return RES;
      }
      return null;
    },
    factoryNetWeight() {
      return (
        this.inputData.factoryFullWeight - this.inputData.factoryEmptyWeight
      );
    },
    contractRemaining0Value() {
      if (
        this.id &&
        this.inputData.refineryNetWeight0 === this.firstRefineryNetWeightValue
      ) {
        return this.contractRemaining0;
      } else {
        return (
          this.contractRemaining0 -
          (this.inputData.refineryNetWeight0 - this.firstRefineryNetWeightValue)
        );
      }
    },
    remittanceNumbers() {
      if (this.inputData.remittanceNumber.length > 1) {
        return this.inputData.remittanceNumber.slice(
          1,
          this.inputData.remittanceNumber.length,
        );
      }
      return [];
    },
    checkDischargeStatusE() {
      const CHECK = (element) => element === "E";
      return this.inputData.dischargeStatus.some(CHECK);
    },
    resourcesDrainTanks() {
      if (this.inputData.loadDestination[0]?.id) {
        return this.resources.drainTanks.filter(
          (d) => d.location === this.inputData.loadDestination[0].id,
        );
      }
      return [];
    },
  },
  watch: {
    "inputData.refineryFullWeight"() {
      this.inputData.refineryNetWeight[0] =
        this.inputData.refineryFullWeight - this.inputData.refineryEmptyWeight;
    },
    "inputData.refineryEmptyWeight"() {
      this.inputData.refineryNetWeight[0] =
        this.inputData.refineryFullWeight - this.inputData.refineryEmptyWeight;
    },
    factoryNetWeight() {
      this.inputData.factoryNetWeight[0] = this.factoryNetWeight;
    },
    // 'inputData.remittanceNumber' () {
    //   this.showForm = false
    //   this.$nextTick(() => { this.showForm = true })
    // }
  },
  created() {
    console.log("this.id", this.id);
    // console.log("sessionStorage.getItem", useSessionStorage());
    this.getDrivers();
    this.getCurrentTime();
    const auth = useCookie("auth");
    this.userData = auth.value;
    if (this.id) {
      this.getData();
    } else {
      this.fillDates();
    }
    if (sessionStorage.getItem("input")) {
      this.dataSaved = true;
    }
    this.inputData.buyer = this.resources.buyers.find(
      (item) => item.title === "پالایش نفت آفتاب",
    ).id;
  },
  mounted() {
    window.onbeforeunload = () => {
      const DATA = {
        inputData: this.inputData,
        plaque: this.plaque,
        firstRefineryNetWeightValue: this.firstRefineryNetWeightValue,
        contractRemaining0: this.contractRemaining0,
        contractRemaining1: this.contractRemaining1,
      };
      sessionStorage.setItem("input", JSON.stringify(DATA));
    };
  },
  methods: {
    getData() {
      this.loading = "get";
      const { $axios } = useNuxtApp();
      $axios
        .get("/api/weighbridgeInput/" + this.id)
        .then((res) => {
          this.inputData.id = res.data.map((item) => item.id);
          this.rowNumber = res.data[0].row;
          this.inputData.product = this.resources.products.find(
            (p) => p.id === res.data[0].product,
          );
          // this.inputData.remittanceNumber = res.data.map(
          //   (item) => item.remittance_number,
          // );
          // this.tempRemittanceNumbers = [...this.inputData.remittanceNumber]
          this.inputData.exchangeContractNumber = res.data.map(
            (item) => item.exchange_contract_number,
          );
          // this.inputData.remittanceNumber.forEach((_, i) => {
          //   console.log("i", i);
          //   // this.getContractRemaining(i);
          // });
          this.inputData.buyer = res.data[0].buyer;
          this.inputData.origin = res.data[0].origin;
          this.inputData.originTank = res.data[0].origin_tank;

          this.plaque =
            res.data[0].truck_number.slice(0, 2) +
            res.data[0].truck_number.slice(2, 3) +
            res.data[0].truck_number.slice(3, 6) +
            res.data[0].truck_number.slice(6, 8);
          this.inputData.tankerNumber = res.data[0].tanker_number;
          this.inputData.driver = res.data[0].driver;

          this.inputData.transportContractor = res.data[0].transport_contractor;
          this.inputData.refineryEnteringDate =
            res.data[0].refinery_entering_date;
          this.inputData.refineryEnteringTime =
            res.data[0].refinery_entering_time;
          this.inputData.refineryLeavingDate =
            res.data[0].refinery_leaving_date;
          this.inputData.refineryLeavingTime =
            res.data[0].refinery_leaving_time;
          this.inputData.refineryFullWeight = res.data[0].refinery_full_weight;
          this.inputData.refineryEmptyWeight =
            res.data[0].refinery_empty_weight;
          this.$nextTick(() => {
            this.inputData.refineryNetWeight = res.data.map(
              (item) => item.refinery_net_weight,
            );
          });
          this.firstRefineryNetWeightValue = res.data[0].refinery_net_weight;
          this.inputData.mehvar_petro = res.data[0].mehvar_petro;
          this.inputData.valueInLiters = res.data.map(
            (item) => item.value_in_liters,
          );
          this.inputData.sixtyDegreeValue = res.data[0].sixty_degree_value;
          this.inputData.specialWeight = res.data[0].special_weight;
          this.inputData.billOfLadingNumber = res.data[0].bill_of_lading_number;
          this.inputData.policeBillOfLadingFare =
            res.data[0].police_bill_of_lading_fare;
          this.separateNumbers();
          this.inputData.securityAppointmentDate =
            res.data[0].security_appointment_date;
          this.inputData.securityAppointmentTime =
            res.data[0].security_appointment_time;
          this.inputData.laboratoryAnnouncementTime =
            res.data[0].laboratory_announcement_time;
          this.inputData.samplingTime = res.data[0].sampling_time;
          this.inputData.laboratoryAnsewrAnnouncementTime =
            res.data[0].laboratory_ansewr_announcement_time;
          this.inputData.sleepTimeAnnouncementToLaboratoryUntilDelivery =
            res.data[0].sleep_time_announcement_to_laboratory_until_delivery;
          this.inputData.laboratoryAnswerSleep =
            res.data[0].laboratory_answer_sleep;
          this.inputData.drainTankName = res.data[0].drain_tank_name;
          this.inputData.weighbridgeEnteringDate =
            res.data[0].weighbridge_entering_date;
          this.inputData.weighbridgeEnteringTime =
            res.data[0].weighbridge_entering_time;
          this.inputData.weighbridgeLeavingDate =
            res.data[0].weighbridge_leaving_date;
          this.inputData.weighbridgeLeavingTime =
            res.data[0].weighbridge_leaving_time;
          this.inputData.factoryFullWeight = res.data[0].factory_full_weight;
          this.inputData.factoryEmptyWeight = res.data[0].factory_empty_weight;
          this.inputData.factoryNetWeight = res.data.map(
            (item) => item.factory_net_weight,
          );
          this.inputData.sedimentationAmount = res.data[0].sedimentation_amount;
          this.inputData.sendStatus = res.data.map((item) => item.send_status);
          this.inputData.loadDestination = res.data.map(
            (item) => item.load_destination,
          );
          this.inputData.loadDestination[0] = this.resources.destinations.find(
            (d) => d.id === this.inputData.loadDestination[0],
          );
          this.inputData.dischargeStatus = res.data.map(
            (item) => item.discharge_status,
          );
          this.inputData.outboundBillOfLadingNumber = res.data.map(
            (item) => item.outbound_bill_of_lading_number,
          );
          for (
            let i = 0;
            i < this.inputData.outboundBillOfLadingNumber.length;
            i++
          ) {
            this.billOfLadingNumbers.push(true);
          }
          this.inputData.weighbridgeLeavingDate2 =
            res.data[0].weighbridge_leaving_date_2;
          this.inputData.weighbridgeLeavingTime2 =
            res.data[0].weighbridge_leaving_time_2;
          this.inputData.description = res.data[0].description;
        })
        .finally(() => {
          this.loading = "";
        });
    },
    getTankerNumber() {
      this.inputData.tankerNumber = "";
      const { $axios } = useNuxtApp();
      globals.getTankerNumber($axios, this.plaque).then((res) => {
        this.inputData.tankerNumber = res;
      });
    },
    save() {
      console.log("refs", this.$refs);
      if (this.$refs.form.validate()) {
        this.loading = "submit";
        const DATA = this.inputData;
        DATA.product = this.inputData.product.id;
        DATA.deletedRemittanceNumbers = this.deletedRemittanceNumbers;
        // DATA.newRemittanceNumbers = this.newRemittanceNumbers
        DATA.shift = this.userData.shift;
        DATA.truckNumber = this.plaque;
        DATA.originSleep = this.originSleep;
        DATA.sleepDuration = this.sleepDuration;
        DATA.totalSleep = this.totalSleep;
        DATA.userId = this.userData.user.id;
        if (!DATA.factoryFullWeight) {
          DATA.factoryFullWeight = 0;
        }
        if (!DATA.factoryEmptyWeight) {
          DATA.factoryEmptyWeight = 0;
        }
        // ++++ if (this.inputData.dischargeStatus[0] === 'T') {
        //   this.inputData.outboundBillOfLadingNumber = null
        // }
        // else {
        //   DATA.totalSleep = null
        // }
        DATA.tankerSleepDuringRoad = this.tankerSleepDuringRoad;
        DATA.sleepTimeAnnouncementToLaboratoryUntilDelivery =
          this.sleepTimeAnnouncementToLaboratoryUntilDelivery;
        DATA.sleepingTimeFromAnsweringUntilWeighbridgeEntering =
          this.sleepingTimeFromAnsweringUntilWeighbridgeEntering;
        if (
          this.inputData.weighbridgeLeavingDate2 &&
          this.inputData.weighbridgeLeavingTime2
        ) {
          DATA.deepDate = globals.calculateDeepDate(
            this.inputData.weighbridgeLeavingDate2,
            this.inputData.weighbridgeLeavingTime2,
          );
        } else {
          DATA.deepDate = globals.calculateDeepDate(
            this.inputData.weighbridgeLeavingDate,
            this.inputData.weighbridgeLeavingTime,
          );
        }

        // DATA.deepDate = this.inputData.weighbridgeLeavingDate
        // if (moment(this.inputData.weighbridgeLeavingTime, 'hh:mm a').isBefore(moment('07:01', 'hh:mm a'))) {
        //   DATA.deepDate = moment(this.inputData.weighbridgeLeavingDate, 'jYYYY/jMM/jDD').subtract(1, 'days').format('jYYYY/jMM/jDD')
        // }
        if (this.inputData.policeBillOfLadingFare) {
          DATA.policeBillOfLadingFare = parseInt(
            this.inputData.policeBillOfLadingFare.replaceAll(",", ""),
          );
          // this.separateNumbers()
        }
        // if (!this.splitData) {
        //   DATA.factoryNetWeight[0] = this.factoryNetWeight
        // }
        // const tempLoadDestination = []
        // this.inputData.loadDestination.forEach((d) => {
        //   tempLoadDestination.push(d.id)
        // })
        // DATA.loadDestination = tempLoadDestination
        DATA.loadDestination[0] = this.inputData.loadDestination[0].id;
        if (!this.id) {
          const { $axios } = useNuxtApp();
          $axios
            .post("/api/weighbridgeInput", DATA)
            .then((res) => {
              this.rowNumber = res.data;
              window.scrollTo(0, 0);
              this.$store.commit(
                "notification/successNotification",
                "رکورد با موفقیت افزوده شد.",
              );
              this.$refs.form.reset();
              this.inputData.buyer = this.resources.buyers.filter(
                (item) => item.title === "پالایش نفت آفتاب",
              )[0].id;
              this.showForm = false;
              this.contractRemainings = [];
              this.contractRemaining0 = null;
              this.contractRemaining1 = null;
              sessionStorage.removeItem("input");
              // this.splitData = false
              this.$nextTick(() => {
                this.plaque = "";
                this.showForm = true;
                this.fillDates();
              });
            })
            .finally(() => {
              this.loading = "";
            });
        } else {
          DATA.row = this.rowNumber;
          $axios
            .put("/api/weighbridgeInput", DATA)
            .then(() => {
              this.$store.commit(
                "notification/successNotification",
                "رکورد با موفقیت ویرایش شد.",
              );
              sessionStorage.removeItem("input");
            })
            .finally(() => {
              this.separateNumbers();
              this.loading = "";
              this.back();
            });
        }
      } else {
        this.$store.commit(
          "notification/errorNotification",
          "لطفاً خطا های فرم را رفع کنید!",
        );
      }
    },
    addRemittanceNumber() {
      this.inputData.remittanceNumber.push("");
      this.inputData.exchangeContractNumber.push("");
      this.inputData.refineryNetWeight.push(0);
      this.inputData.valueInLiters.push("");
      this.inputData.sendStatus.push("");
      this.inputData.factoryNetWeight.push(0);
      this.billOfLadingNumbers.push(true);
      this.inputData.dischargeStatus.push("");
      this.inputData.outboundBillOfLadingNumber.push("");
    },
    removeRemittanceNumber(i) {
      if (this.id && this.inputData.id[i]) {
        this.deletedRemittanceNumbers.push(this.inputData.id[i]);
        this.inputData.id.splice(i, 1);
      }
      this.contractRemainings.splice(i, 1);
      this.inputData.remittanceNumber.splice(i, 1);
      this.inputData.exchangeContractNumber.splice(i, 1);
      this.inputData.factoryNetWeight.splice(i, 1);
      this.inputData.refineryNetWeight.splice(i, 1);
      this.inputData.refineryNetWeight[0] =
        this.inputData.refineryFullWeight - this.inputData.refineryEmptyWeight;
      this.inputData.valueInLiters.splice(i, 1);
      this.inputData.sendStatus.splice(i, 1);
      this.inputData.loadDestination.splice(i, 1);
      this.inputData.dischargeStatus.splice(i, 1);
      this.inputData.outboundBillOfLadingNumber.splice(i, 1);
    },
    getContractRemaining(index) {
      const { $axios } = useNuxtApp();
      if (this.inputData.remittanceNumber[index]) {
        $axios
          .get(
            "/api/contractRemaining/" + this.inputData.remittanceNumber[index],
          )
          .then((res) => {
            this.refreshRemittanceNumber = true;
            this.$nextTick(() => {
              this.refreshRemittanceNumber = false;
            });
            this.contractRemainings[index] = res.data.buy_value;
            this.contractRemainings[index] -=
              this.inputData.refineryNetWeight[index];
            this.inputData.exchangeContractNumber[index] =
              res.data.exchange_contract_number;
          })
          .catch(() => {
            this.inputData.exchangeContractNumber[index] = "";
          });
      } else {
        this.contractRemainings[index] = null;
        this.refreshRemittanceNumber = true;
        this.$nextTick(() => {
          this.refreshRemittanceNumber = false;
        });
      }
    },
    timeRangeMask(v) {
      return globals.timeRangeMask(v);
    },
    fillDates() {
      this.inputData.refineryEnteringDate = globals.today();
      this.inputData.refineryLeavingDate = globals.today();
      this.inputData.securityAppointmentDate = globals.today();
      this.inputData.weighbridgeEnteringDate = globals.today();
      this.inputData.weighbridgeLeavingDate = globals.today();
    },
    restoreData() {
      this.inputData = JSON.parse(sessionStorage.getItem("input")).inputData;
      this.rowNumber = JSON.parse(sessionStorage.getItem("input")).rowNumber;
      this.plaque = JSON.parse(sessionStorage.getItem("input")).plaque;
      this.firstRefineryNetWeightValue = JSON.parse(
        sessionStorage.getItem("input"),
      ).firstRefineryNetWeightValue;
      this.contractRemaining0 = JSON.parse(
        sessionStorage.getItem("input"),
      ).contractRemaining0;
      this.contractRemaining1 = JSON.parse(
        sessionStorage.getItem("input"),
      ).contractRemaining1;
      this.dataSaved = false;
      sessionStorage.removeItem("input");
    },
    separateNumbers() {
      if (this.inputData.policeBillOfLadingFare) {
        this.inputData.policeBillOfLadingFare = new Intl.NumberFormat().format(
          this.inputData.policeBillOfLadingFare.toString().replaceAll(",", ""),
        );
      }
    },
    getCurrentTime() {
      // const { $axios } = useNuxtApp();
      globals.getCurrentTime().then((res) => {
        this.currentTime = moment(res).format("jYYYY-/jMM-jDDTHH:mm");
      });
    },
    getDrivers() {
      const { $axios } = useNuxtApp();
      $axios
        .get("/api/weighbridgeInputDrivers")
        .then((res) => {
          this.drivers = res.data;
        })
        .finally(() => {
          this.driversLoading = false;
        });
    },
    driverOuterIcon() {
      if (this.inputData.driver) {
        return "mdi-pen";
      } else if (this.$refs.driver && this.$refs.driver.lazySearch) {
        return "mdi-content-save-outline";
      }
    },
    addDriver() {
      this.drivers.push(this.$refs.driver._data.lazySearch);
      this.inputData.driver = this.$refs.driver._data.lazySearch;
    },
    changeDriverName() {
      this.changeDriverNameDialog = true;
    },
    closeChangeDriverNameDialog(v) {
      this.changeDriverNameDialog = false;
      if (v) {
        const INDEX = this.drivers.indexOf(this.inputData.driver);
        this.drivers.splice(INDEX, 1, v);
        this.inputData.driver = this.drivers[INDEX];
      }
    },
    duplicateBillOfLadingNumberRule(i) {
      if (this.inputData.outboundBillOfLadingNumber[i]?.length > 0) {
        if (
          this.inputData.outboundBillOfLadingNumber.filter(
            (item) => item === this.inputData.outboundBillOfLadingNumber[i],
          ).length > 1
        ) {
          return "شماره بارنامه خروجی تکراری می باشد!";
        }
        return true;
      }
      return true;
    },
    duplicateBillOfLadingNumberApiRule(i) {
      if (!this.billOfLadingNumbers[i]) {
        return "شماره بارنامه خروجی تکراری می باشد!";
      }
      return true;
    },
    checkDuplicateBillOfLadingNumber(billOfLadingNumber, i) {
      const { $axios } = useNuxtApp();
      if (billOfLadingNumber) {
        $axios
          .get("/api/checkDuplicateBillOfLadingNumber", {
            params: {
              id: this.id ? this.inputData.id[i] : null,
              billOfLadingNumber,
            },
          })
          .then(() => {
            this.billOfLadingNumbers[i] = true;
          })
          .catch(() => {
            this.billOfLadingNumbers[i] = false;
          })
          .finally(() => {
            this.showForm = false;
            this.showForm = true;
            this.duplicateBillOfLadingNumberApiRule(i);
          });
      } else {
        this.billOfLadingNumbers[i] = true;
      }
    },
    removeValue(i) {
      if (this.inputData.dischargeStatus[i] === "T") {
        this.inputData.outboundBillOfLadingNumber[i] = "";
      }
    },
    back() {
      this.$emit("back");
    },
  },
};
</script>
