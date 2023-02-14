export default {
  'head': {
    'transaction': 0,
    'signature': 20883,
    'environment': {
      'station_name': '6239',
      'table_name': 'Test',
      'model': 'CR6',
      'serial_no': '6239',
      'os_version': 'CR6.Std.12.01',
      'prog_name': 'CPU:Updated_CR6_Sample_Template.CR6'
    },
    'fields': [
      {
        'name': 'batt_volt_Min',
        'type': 'xsd:float',
        'units': 'Volts',
        'process': 'Min',
        'settable': false
      },
      {
        'name': 'PanelT',
        'type': 'xsd:float',
        'units': 'Deg_C',
        'process': 'Smp',
        'settable': false
      }
    ]
  },
  'data': [
    {
      'time': '2023-02-13T16:55:56',
      'no': 0,
      'vals': [
        11.67,
        24.7
      ]
    },
    {
      'time': '2023-02-13T16:55:51',
      'no': 0,
      'vals': [
        11.7,
        21.75
      ]
    }
  ]
};
